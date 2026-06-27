import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("textbooks")
    .select(`id, title, author, course, professor, price, cover_url, has_senior_notes, condition, status, created_at, profiles!seller_id (display_name, faculty, year, is_verified)`)
    .eq("status", "available")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "認証が必要です" }, { status: 401 });

  const body = await request.json();
  const { isbn, title, author, course, professor, price, condition, has_senior_notes, cover_url } = body;
  if (!title || !price) return NextResponse.json({ error: "タイトルと価格は必須です" }, { status: 400 });

  const priceNum = parseInt(price, 10);
  if (isNaN(priceNum) || priceNum < 0) return NextResponse.json({ error: "価格が不正です" }, { status: 400 });

  const { data, error } = await supabase.from("textbooks").insert({
    seller_id: user.id, isbn: isbn || null, title, author: author || null,
    course: course || null, professor: professor || null, price: priceNum,
    condition: condition || null, has_senior_notes: Boolean(has_senior_notes), cover_url: cover_url || null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
