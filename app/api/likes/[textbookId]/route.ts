import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(_req: NextRequest, { params }: { params: { textbookId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "認証が必要です" }, { status: 401 });

  if (!rateLimit(`like:${user.id}`, 30, 60 * 1000)) {
    return NextResponse.json({ error: "操作が速すぎます" }, { status: 429 });
  }

  const { error } = await supabase.from("likes").insert({
    user_id: user.id,
    textbook_id: params.textbookId,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { textbookId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "認証が必要です" }, { status: 401 });

  const { error } = await supabase.from("likes").delete()
    .eq("user_id", user.id)
    .eq("textbook_id", params.textbookId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
