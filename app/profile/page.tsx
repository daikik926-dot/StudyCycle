import {
  BookOpen,
  ChevronRight,
  Gift,
  ListPlus,
  LogOut,
  Pencil,
  ShieldCheck,
  Star,
  TicketPercent,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StudyCycleLogo } from "@/components/StudyCycleLogo";
import { createClient } from "@/lib/supabase/server";
import { ProfileTabs } from "@/components/ProfileTabs";

type TextbookRow = {
  id: string;
  title: string;
  course: string | null;
  professor: string | null;
  price: number;
  status: string;
};

type CouponRow = {
  id: string;
  coupon_type: string;
  serial_code: string;
  expires_at: string;
  is_used: boolean;
};

async function fetchProfileData() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const [profileRes, listingsRes, couponsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("textbooks").select("id, title, course, professor, price, status").eq("seller_id", user.id).order("created_at", { ascending: false }),
      supabase.from("coupons").select("*").eq("user_id", user.id).eq("is_used", false),
    ]);

    return {
      profile: profileRes.data,
      listings: (listingsRes.data ?? []) as TextbookRow[],
      coupons: (couponsRes.data ?? []) as CouponRow[],
    };
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const data = await fetchProfileData();

  const isDemoMode = !data;
  const profile = data?.profile ?? {
    display_name: "Demo Student",
    handle: "demo_user",
    faculty: "経済学部",
    year: 2,
    is_verified: true,
    rating: 4.9,
    items_listed: 8,
    items_purchased: 5,
  };

  const sellingBooks = (data?.listings ?? []).filter((b) => b.status !== "sold");
  const historyBooks = (data?.listings ?? []).filter((b) => b.status === "sold");
  const coupons = data?.coupons ?? [];

  const demoSelling = [
    { id: "1", title: "ミクロ経済学入門", course: "基礎ミクロ経済", professor: "佐藤教授", price: 1800, status: "available" },
    { id: "2", title: "統計解析ハンドブック", course: "データ分析", professor: "伊藤教授", price: 2100, status: "reserved" },
  ];
  const demoHistory = [
    { id: "3", title: "現代社会学講義", course: "社会学概論", professor: "", price: 1200, status: "sold" },
    { id: "4", title: "教育心理学ノート", course: "学習心理学", professor: "", price: 1500, status: "sold" },
  ];
  const demoCoupons = [
    { id: "cafe-10", coupon_type: "cafe-10", serial_code: "SC-CAFE-2048", expires_at: "2026-06-30", is_used: false },
    { id: "bookstore-300", coupon_type: "bookstore-300", serial_code: "SC-BOOK-7312", expires_at: "2026-07-15", is_used: false },
  ];

  const displaySelling = isDemoMode ? demoSelling : sellingBooks;
  const displayHistory = isDemoMode ? demoHistory : historyBooks;
  const displayCoupons = isDemoMode ? demoCoupons : coupons;

  const COUPON_LABEL: Record<string, string> = {
    "cafe-10": "学内コーヒーショップ 10% OFF",
    "bookstore-300": "大学生協 書籍 ¥300 OFF",
  };

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
            {!isDemoMode && (
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">ログアウト</span>
                </button>
              </form>
            )}
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
                <h1 className="mt-1 text-2xl font-black">{profile.display_name}</h1>
                <p className="mt-1 text-sm font-bold text-white/85">
                  {profile.faculty} {profile.year ? `${profile.year}年` : ""}{profile.handle ? ` / @${profile.handle}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.is_verified && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-[#0056b3]">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      学生認証済み（.ac.jp）
                    </span>
                  )}
                  {profile.rating > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white ring-1 ring-white/25">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" aria-hidden="true" />
                      ))}
                      {Number(profile.rating).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
              {!isDemoMode && (
                <Link
                  href="/profile/edit"
                  className="shrink-0 inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/15 px-3 text-xs font-black text-white ring-1 ring-white/30 transition hover:bg-white/25"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  編集
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-200">
            <Stat label="出品数" value={String(profile.items_listed ?? displaySelling.length)} />
            <Stat label="購入数" value={String(profile.items_purchased ?? displayHistory.length)} />
          </div>
        </section>

        {displayCoupons.length > 0 && (
          <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
                  <Gift className="h-5 w-5 text-[#28a745]" aria-hidden="true" />
                  獲得クーポン
                </h2>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-500">
                  教科書出品で獲得した学内利用向けクーポンです。
                </p>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-[#28a745]">
                {displayCoupons.length}枚利用可能
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {displayCoupons.map((coupon) => (
                <Coupon
                  key={coupon.id}
                  href={`/coupons/${coupon.id}`}
                  title={COUPON_LABEL[coupon.coupon_type] ?? coupon.coupon_type}
                  code={coupon.serial_code}
                  expires={new Date(coupon.expires_at).toLocaleDateString("ja-JP")}
                />
              ))}
            </div>
          </section>
        )}

        <ProfileTabs selling={displaySelling} history={displayHistory} />

        <section className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-base font-black text-[#0056b3]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                取引の安全について
              </h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                学内外を問わず、不特定多数の人が集まる場所での受け渡しを推奨いたします。
              </p>
            </div>
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
      <p className="mt-1 text-xs font-black text-slate-500">{label}</p>
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
