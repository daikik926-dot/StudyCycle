import {
  GraduationCap,
  Home,
  ListPlus,
  Search,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { StudyCycleLogo } from "@/components/StudyCycleLogo";
import { TextbookCard } from "@/components/TextbookCard";
import { textbooks } from "@/lib/textbooks";

const tabs = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Search", icon: Search, href: "#" },
  { label: "List", icon: ListPlus, href: "/listings" },
  { label: "Profile", icon: UserRound, href: "/profile" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper pb-24 md:pb-0">
      <nav className="sticky top-0 z-40 border-b border-stone-200 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-ink">
            <StudyCycleLogo size={40} className="rounded-lg shadow-sm" />
            <span className="text-xl font-black">StudyCycle</span>
          </Link>

          <label className="relative mx-auto hidden w-full max-w-xl sm:block">
            <span className="sr-only">Search textbooks</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="授業名・教科書名で探す"
              className="h-11 w-full rounded-lg border border-stone-200 bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-leaf focus:ring-4 focus:ring-green-100"
            />
          </label>

          <Link
            href="/listings"
            className="ml-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-leaf px-4 text-sm font-bold text-white shadow-sm transition hover:bg-green-700"
          >
            <ListPlus className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">List Textbook</span>
          </Link>
        </div>
        <div className="px-4 pb-3 sm:hidden">
          <label className="relative block">
            <span className="sr-only">Search textbooks</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="授業名・教科書名で探す"
              className="h-11 w-full rounded-lg border border-stone-200 bg-white pl-12 pr-4 text-sm outline-none focus:border-leaf focus:ring-4 focus:ring-green-100"
            />
          </label>
        </div>
      </nav>

      <section className="border-b border-stone-200 bg-[linear-gradient(135deg,#fbfaf6_0%,#e7f7ef_48%,#fff7d8_100%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-16 lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-bold text-leaf">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              University Textbook Exchange
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
              学内で教科書を探す・譲る。
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl">
              授業にひもづいた教科書と先輩メモを、安心できる学内取引で受け継げます。
            </p>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,#b9efd1_0,transparent_28%),radial-gradient(circle_at_78%_75%,#f8e79c_0,transparent_26%)]" />
            <div className="relative grid h-full min-h-72 place-items-center p-8">
              <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                {textbooks.slice(0, 6).map((book) => (
                  <div
                    key={book.id}
                    className="aspect-[3/4] overflow-hidden rounded-md border border-stone-200 bg-white shadow-md"
                  >
                    <img
                      src={book.cover}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-ink sm:text-3xl">
              今週のおすすめ教科書
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              メモ付きの出品から、次の履修にすぐ使える一冊を。
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {textbooks.map((textbook) => (
            <TextbookCard key={textbook.id} textbook={textbook} />
          ))}
        </div>
      </section>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 px-2 pt-2 shadow-[0_-10px_30px_rgba(31,41,51,0.08)] backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto grid max-w-md grid-cols-4">
          {tabs.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg text-xs font-bold text-stone-500 transition hover:bg-mint hover:text-leaf"
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
