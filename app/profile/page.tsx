"use client";

import {
  BookOpen,
  ChevronRight,
  Gift,
  History,
  Home,
  ListPlus,
  Search,
  ShieldCheck,
  Star,
  TicketPercent,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StudyCycleLogo } from "@/components/StudyCycleLogo";

const listedBooks = [
  {
    title: "ミクロ経済学入門",
    course: "基礎ミクロ経済 / 佐藤教授",
    price: "¥1,800",
    status: "Selling",
  },
  {
    title: "統計解析ハンドブック",
    course: "データ分析 / 伊藤教授",
    price: "¥2,100",
    status: "Reserved",
  },
];

const history = [
  {
    title: "現代社会学講義",
    course: "社会学概論",
    price: "¥1,200",
    status: "Completed",
  },
  {
    title: "教育心理学ノート",
    course: "学習心理学",
    price: "¥1,500",
    status: "Completed",
  },
];

const tabs = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Search", icon: Search, href: "#" },
  { label: "List", icon: ListPlus, href: "/listings" },
  { label: "Profile", icon: UserRound, href: "/profile" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"selling" | "history">("selling");
  const shownBooks = activeTab === "selling" ? listedBooks : history;

  return (
    <main className="min-h-screen bg-slate-50 pb-24 text-slate-900 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <StudyCycleLogo size={40} className="rounded-lg shadow-sm" />
            <span className="text-lg font-black text-slate-950">StudyCycle</span>
          </Link>
          <Link
            href="/listings"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#28a745] px-3 text-sm font-black text-white transition hover:bg-green-700"
          >
            <ListPlus className="h-4 w-4" aria-hidden="true" />
            出品
          </Link>
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
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
                  User Profile
                </p>
                <h1 className="mt-1 text-2xl font-black">Demo Student</h1>
                <p className="mt-1 text-sm font-bold text-white/85">
                  経済学部 2年 / demo_user
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-[#0056b3]">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    Verified Student (.ac.jp)
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white ring-1 ring-white/25">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300"
                        aria-hidden="true"
                      />
                    ))}
                    4.9
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-200">
            <Stat label="Items Listed" value="8" />
            <Stat label="Books Purchased" value="5" />
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
                <Gift className="h-5 w-5 text-[#28a745]" aria-hidden="true" />
                Available Digital Coupons
              </h2>
              <p className="mt-1 text-sm font-bold leading-6 text-slate-500">
                教科書出品で獲得した学内利用向けクーポンです。
              </p>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-[#28a745]">
              2 Available
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Coupon
              href="/coupons/cafe-10"
              title="Cafe 10% OFF"
              code="SC-CAFE-2048"
              expires="2026/06/30"
            />
            <Coupon
              href="/coupons/bookstore-300"
              title="Bookstore ¥300 OFF"
              code="SC-BOOK-7312"
              expires="2026/07/15"
            />
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <h2 className="text-lg font-black text-slate-950">My Listings</h2>
            <div className="mt-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("selling")}
                className={
                  activeTab === "selling"
                    ? "h-10 rounded-md bg-white text-sm font-black text-[#0056b3] shadow-sm"
                    : "h-10 rounded-md text-sm font-black text-slate-500"
                }
              >
                Selling
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={
                  activeTab === "history"
                    ? "h-10 rounded-md bg-white text-sm font-black text-[#0056b3] shadow-sm"
                    : "h-10 rounded-md text-sm font-black text-slate-500"
                }
              >
                History
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {shownBooks.map((book) => (
              <div key={book.title} className="flex items-center gap-3 p-4 sm:p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#0056b3]">
                  {activeTab === "selling" ? (
                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <History className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-slate-950">
                    {book.title}
                  </p>
                  <p className="mt-1 truncate text-xs font-bold text-slate-500">
                    {book.course}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#0056b3]">{book.price}</p>
                  <p className="mt-1 text-xs font-black text-[#28a745]">
                    {book.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-5">
          <Link
            href="/textbooks/microeconomics/chat"
            className="flex items-center justify-between gap-3"
          >
            <div>
              <h2 className="flex items-center gap-2 text-base font-black text-[#0056b3]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                Safety Guidelines
              </h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                受け渡しは図書館入口、大学生協など学内の公共の場所を推奨します。
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[#0056b3]" aria-hidden="true" />
          </Link>
        </section>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto grid max-w-md grid-cols-4">
          {tabs.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className={
                label === "Profile"
                  ? "flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg bg-blue-50 text-xs font-black text-[#0056b3]"
                  : "flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg text-xs font-black text-slate-500 transition hover:bg-blue-50 hover:text-[#0056b3]"
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 text-center">
      <p className="text-3xl font-black text-[#0056b3]">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function Coupon({
  href,
  title,
  code,
  expires,
}: {
  href: string;
  title: string;
  code: string;
  expires: string;
}) {
  return (
    <Link href={href} className="block rounded-lg border border-green-100 bg-green-50 p-4 transition hover:border-[#28a745] hover:bg-green-100">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#28a745] text-white">
          <TicketPercent className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-black text-slate-950">{title}</h3>
          <p className="mt-2 rounded bg-white px-2 py-1 font-mono text-sm font-black text-[#0056b3]">
            {code}
          </p>
          <p className="mt-2 text-xs font-bold text-slate-500">
            Expires: {expires}
          </p>
        </div>
      </div>
    </Link>
  );
}
