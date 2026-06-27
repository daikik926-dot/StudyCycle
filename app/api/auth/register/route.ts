import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    const admin = createAdminClient();

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      user_metadata: { display_name: displayName },
      email_confirm: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const baseHandle = email.split("@")[0];
    const handle = `${baseHandle}_${data.user.id.slice(0, 6)}`;

    await admin.from("profiles").upsert(
      {
        id: data.user.id,
        handle,
        display_name: displayName || baseHandle,
        is_verified: email.endsWith(".ac.jp"),
      },
      { onConflict: "id" }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
