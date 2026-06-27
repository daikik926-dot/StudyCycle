import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    const admin = getAdminClient();

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

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: data.user.id,
        handle,
        display_name: displayName || baseHandle,
        is_verified: email.endsWith(".ac.jp"),
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error("profile upsert error:", profileError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
