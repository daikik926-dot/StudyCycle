import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(toSet) {
          try { toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );
}

function diagnoseEnv(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return `環境変数チェック: URL=${url ? `あり(${url.length}文字)` : "なし"}, KEY=${key ? `あり(${key.length}文字)` : "なし"}`;
  }
  return null;
}

export async function POST(_req: NextRequest, { params }: { params: { textbookId: string } }) {
  try {
    const envError = diagnoseEnv();
    if (envError) return NextResponse.json({ error: envError }, { status: 500 });

    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });

    const { error } = await supabase
      .from("likes")
      .insert({ user_id: user.id, textbook_id: params.textbookId });

    if (error && error.code !== "23505") {
      return NextResponse.json({ error: `${error.message} (${error.code})` }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: `予期しないエラー: ${String(e)}` }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { textbookId: string } }) {
  try {
    const envError = diagnoseEnv();
    if (envError) return NextResponse.json({ error: envError }, { status: 500 });

    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });

    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("textbook_id", params.textbookId);

    if (error) return NextResponse.json({ error: `${error.message} (${error.code})` }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: `予期しないエラー: ${String(e)}` }, { status: 500 });
  }
}
