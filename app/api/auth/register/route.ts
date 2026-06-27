import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceKey) {
    return NextResponse.json({ error: `Missing env: url=${!!url} anon=${!!anonKey} service=${!!serviceKey}` }, { status: 500 });
  }

  let email: string, password: string, displayName: string;
  try {
    ({ email, password, displayName } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Supabase Auth REST API を直接呼び出す
  let signupRes: Response;
  try {
    signupRes = await fetch(`${url}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        email,
        password,
        data: { display_name: displayName },
      }),
    });
  } catch (err) {
    return NextResponse.json({ error: `Network error: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
  }

  const signupData = await signupRes.json();

  if (!signupRes.ok) {
    const msg = signupData?.error_description || signupData?.msg || signupData?.message || JSON.stringify(signupData);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const userId: string = signupData?.id;
  if (!userId) {
    return NextResponse.json({ error: `No user id in response: ${JSON.stringify(signupData)}` }, { status: 400 });
  }

  // 管理者権限でプロフィールを作成
  const baseHandle = email.split("@")[0];
  const handle = `${baseHandle}_${userId.slice(0, 6)}`;

  const profileRes = await fetch(`${url}/rest/v1/profiles`, {
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

  if (!profileRes.ok) {
    const profileData = await profileRes.json().catch(() => ({}));
    console.error("profile error:", profileData);
    // プロフィール失敗でも登録自体は成功済み
  }

  return NextResponse.json({ success: true });
}
