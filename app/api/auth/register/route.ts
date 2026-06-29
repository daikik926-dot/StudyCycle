import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`register:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "しばらく時間をおいてから再度お試しください" }, { status: 429 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    const missing = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !anonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ].filter(Boolean).join(", ");
    return NextResponse.json({ error: `Server configuration error: missing ${missing}` }, { status: 500 });
  }

  // デバッグ用：実際にデプロイで使われているキーの形を確認
  const keyInfo = `key先頭=${anonKey.slice(0, 8)} 長さ=${anonKey.length} URL=${url}`;

  let email: string, password: string, displayName: string;
  try {
    ({ email, password, displayName } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  let signupRes: Response;
  try {
    signupRes = await fetch(`${url}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ email, password, data: { display_name: displayName } }),
    });
  } catch (err) {
    return NextResponse.json({ error: `Network error: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
  }

  const signupData = await signupRes.json();
  if (!signupRes.ok) {
    const msg = signupData?.error_description || signupData?.msg || signupData?.message || JSON.stringify(signupData);
    return NextResponse.json({ error: `${msg} / ${keyInfo}` }, { status: 400 });
  }

  const userId: string = signupData?.id;

  if (userId && serviceKey) {
    try {
      const baseHandle = email.split("@")[0];
      const handle = `${baseHandle}_${userId.slice(0, 6)}`;
      await fetch(`${url}/rest/v1/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
          "Prefer": "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          id: userId,
          handle,
          display_name: displayName || baseHandle,
          is_verified: email.endsWith(".ac.jp"),
        }),
      });
    } catch {
      // プロフィール作成に失敗しても登録自体は継続
    }
  }

  return NextResponse.json({ success: true });
}
