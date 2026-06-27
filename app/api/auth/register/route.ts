import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !anonKey || !serviceKey) {
      return NextResponse.json({ error: "Server configuration error: missing env vars" }, { status: 500 });
    }

    // 通常の登録（メール確認あり）
    const anonClient = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await anonClient.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "User creation failed: no user returned" }, { status: 400 });
    }

    // 管理者権限でプロフィールを作成（トリガーに依存しない）
    const adminClient = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const baseHandle = email.split("@")[0];
    const handle = `${baseHandle}_${data.user.id.slice(0, 6)}`;

    const { error: profileError } = await adminClient.from("profiles").upsert(
      {
        id: data.user.id,
        handle,
        display_name: displayName || baseHandle,
        is_verified: email.endsWith(".ac.jp"),
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error("profile error:", profileError.message);
      // プロフィール作成失敗でもユーザー作成は成功済みなので続行
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error
        ? `${err.name}: ${err.message}`
        : JSON.stringify(err, Object.getOwnPropertyNames(err as object)) || "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
