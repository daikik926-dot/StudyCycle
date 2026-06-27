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
