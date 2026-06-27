import {
  ChevronRight,
  Gift,
  ListPlus,
  ShieldCheck,
  Star,
  TicketPercent,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StudyCycleLogo } from "@/components/StudyCycleLogo";
import { ProfileTabs } from "@/components/ProfileTabs";
import { LogoutButton } from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, faculty, year, is_verified, rating, items_listed, items_purchased, handle")
    .eq("id", user.id)
    .single();

  const { data: listings } = await supabase
    .from("textbooks")
    .select("id, title, course, professor, price, status")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  const selling = (listings ?? []).filter((b) => b.status === "available" || b.status === "reserved");
  const history = (listings ?? []).filter((b) => b.status === "sold");

  const displayName = profile?.display_name ?? user.email?.split("@")[0] ?? "ユーザー";
  const faculty = profile?.faculty ?? "";
  const year = profile?.year ? `${profile.year}年` : "";
  const handle = profile?.handle ?? "";
  const isVerified = profile?.is_verified ?? false;
  const rating = profile?.rating ?? 0;
  const itemsListed = profile?.items_listed ?? selling.length;
  const itemsPurchased = profile?.items_purchased ?? history.length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <StudyCycleLogo size={40} className="rounded-lg shadow-sm" />
            <span className="text-lg font-black text-slate-950">StudyCycle</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/listings"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#28a745] px-3 text-sm font-black text-white transition hover:bg-green-700"
            >
              <ListPlus className="h-4 w-4" aria-hidden="true" />
              出品
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#0056b3_0%,#0f6fce_56%,#28a745_100%)] px-5 py-6 text-white sm:px-6">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-white/15 text-white ring-1 ring-white/30">
                <UserRound className="h-8 w-8" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">プロフィール</p>
                <h1 className="mt-1 text-2xl font-black">{displayName}</h1>
                <p className="mt-1 text-sm font-bold text-white/85">
                  {[faculty, year, handle].filter(Boolean).join(" / ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {isVerified && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-[#0056b3]">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      大学認証済み (.ac.jp)
                    </span>
                  )}
                  {rating > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white ring-1 ring-white/25">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" aria-hidden="true" />
                      ))}
                      {Number(rating).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-slate-200">
            <Stat label="出品数" value={String(itemsListed)} />
            <Stat label="購入数" value={String(itemsPurchased)} />
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
                <Gift className="h-5 w-5 text-[#28a745]" aria-hidden="true" />
                デジタルクーポン
              </h2>
              <p className="mt-1 text-sm font-bold leading-6 text-slate-500">
                教科書出品で獲得した学内利用向けクーポンです。
              </p>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-[#28a745]">
              2枚利用可能
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Coupon href="/coupons/cafe-10" title="学内コーヒーショップ 10% OFF" code="SC-CAFE-2048" expires="2026/06/30" />
            <Coupon href="/coupons/bookstore-300" title="生協書籍 ¥300 OFF" code="SC-BOOK-7312" expires="2026/07/15" />
          </div>
        </section>

        <ProfileTabs selling={selling} history={history} />

        <section className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-base font-black text-[#0056b3]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                取引の安全について
              </h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                受け渡しは図書館入口、大学生協など学内の公共の場所を推奨します。
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[#0056b3]" aria-hidden="true" />
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 text-center">
      <p className="text-3xl font-black text-[#0056b3]">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
    </div>
  );
}

function Coupon({ href, title, code, expires }: { href: string; title: string; code: string; expires: string }) {
  return (
    <Link href={href} className="block rounded-lg border border-green-100 bg-green-50 p-4 transition hover:border-[#28a745] hover:bg-green-100">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#28a745] text-white">
          <TicketPercent className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-black text-slate-950">{title}</h3>
          <p className="mt-2 rounded bg-white px-2 py-1 font-mono text-sm font-black text-[#0056b3]">{code}</p>
          <p className="mt-2 text-xs font-bold text-slate-500">有効期限: {expires}</p>
        </div>
      </div>
    </Link>
  );
}
