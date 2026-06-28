import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StudyCycleLogo } from "@/components/StudyCycleLogo";
import { createClient } from "@/lib/supabase/server";
import { ProfileEditForm } from "@/components/ProfileEditForm";

export default async function ProfileEditPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, handle, faculty, year")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/profile"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0056b3] transition hover:bg-slate-50"
            aria-label="プロフィールに戻る"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="flex items-center gap-3">
            <StudyCycleLogo size={36} className="rounded-lg shadow-sm" />
            <h1 className="text-xl font-black text-slate-950">プロフィール編集</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <ProfileEditForm
          initialDisplayName={profile?.display_name ?? ""}
          initialHandle={profile?.handle ?? ""}
          initialFaculty={profile?.faculty ?? ""}
          initialYear={profile?.year ?? null}
        />
      </div>
    </main>
  );
}
