import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "認証が必要です" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "JPG / PNG / WEBP のみアップロードできます" }, { status: 400 });
  if (file.size > MAX_SIZE_BYTES) return NextResponse.json({ error: "ファイルサイズは5MB以下にしてください" }, { status: 400 });

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const fileName = `${user.id}/${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage.from("textbook-covers").upload(fileName, bytes, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("textbook-covers").getPublicUrl(fileName);
  return NextResponse.json({ url: publicUrl }, { status: 201 });
}
