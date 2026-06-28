import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("textbooks")
    .select(`id, title, author, course, professor, price, cover_url, has_senior_notes, condition, status, isbn, created_at, profiles!seller_id (display_name, faculty, year, is_verified)`)
    .eq("id", params.id)
    .single();
  if (error || !data) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });

  const { status } = await req.json();
  const validStatuses = ["available", "reserved", "sold"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "無効なステータスです" }, { status: 400 });
  }

  // 自分の出品のみ変更可能
  const { data: textbook } = await supabase
    .from("textbooks")
    .select("seller_id")
    .eq("id", params.id)
    .single();

  if (!textbook || textbook.seller_id !== user.id) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const { error } = await supabase
    .from("textbooks")
    .update({ status })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
