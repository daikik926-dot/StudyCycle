import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest, { params }: { params: { textbookId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "認証が必要です" }, { status: 401 });

  const { data, error } = await supabase.from("messages")
    .select("id, sender_type, content, created_at")
    .eq("textbook_id", params.textbookId)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest, { params }: { params: { textbookId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "認証が必要です" }, { status: 401 });

  const { content } = await request.json();
  if (!content || typeof content !== "string" || content.trim().length === 0)
    return NextResponse.json({ error: "メッセージを入力してください" }, { status: 400 });
  if (content.length > 1000)
    return NextResponse.json({ error: "メッセージが長すぎます（最大1000文字）" }, { status: 400 });

  const { data, error } = await supabase.from("messages").insert({
    textbook_id: params.textbookId, sender_id: user.id, sender_type: "buyer", content: content.trim(),
  }).select("id, sender_type, content, created_at").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
