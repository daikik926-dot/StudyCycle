import {
  GraduationCap,
  Heart,
  ListPlus,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { StudyCycleLogo } from "@/components/StudyCycleLogo";
import { TextbookCard } from "@/components/TextbookCard";
import { textbooks as demoTextbooks, type Textbook } from "@/lib/textbooks";
import { createClient } from "@/lib/supabase/server";
import { SearchBar } from "@/components/SearchBar";

async function fetchTextbooks(query: string, sort: string): Promise<Textbook[]> {
  try {
    const supabase = createClient();
    const orderCol = sort === "likes" ? "likes_count" : "created_at";
    let q = supabase
      .from("textbooks")
      .select(`
        id, title, author, course, professor, price,
        cover_url, has_senior_notes, condition, likes_count,
        profiles!seller_id (display_name, faculty, year)
      `)
      .eq("status", "available")
      .order(orderCol, { ascending: false })
      .limit(12);

    if (query) {
      q = q.or(`title.ilike.%${query}%,course.ilike.%${query}%,author.ilike.%${query}%`);
    }

    const { data, error } = await q;

    if (error || !data || data.length === 0) {
      return filterDemo(demoTextbooks, query, sort);
    }

    return data.map((row) => {
      const p = (Array.isArray(row.profiles) ? row.profiles[0] : row.profiles) as { display_name: string; faculty: string | null; year: number | null } | null;
      return {
        id: row.id,
        title: row.title,
        author: row.author ?? "",
        course: row.course ?? "",
        professor: row.professor ?? "",
        price: `¥${(row.price as number).toLocaleString()}`,
        cover: row.cover_url ?? "/covers/economics.svg",
        note: row.has_senior_notes ? "先輩メモ付き" : "",
        condition: row.condition ?? "",
        seller: p ? `${p.faculty ?? ""} ${p.year ? p.year + "年" : ""}`.trim() : "",
        likesCount: row.likes_count ?? 0,
      };
    });
  } catch {
    return filterDemo(demoTextbooks, query, sort);
  }
}

function filterDemo(books: Textbook[], query: string, sort: string): Textbook[] {
  let result = books;
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.course.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
  }
  if (sort === "likes") {
    result = [...result].sort((a, b) => (b.likesCount ?? 0) - (a.likesCount ?? 0));
  }
  return result;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { q?: string; sort?: string };
}) {
  const query = searchParams?.q ?? "";
  const sort = searchParams?.sort ?? "new";
  const textbooks = await fetchTextbooks(query, sort);

  return (
    <main className="min-h-screen bg-paper">
      <nav className="sticky top-0 z-40 border-b border-stone-200 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-ink">
            <StudyCycleLogo size={40} className="rounded-lg shadow-sm" />
            <span className="text-xl font-black">StudyCycle</span>
          </Link>

          <SearchBar className="relative mx-auto hidden w-full max-w-xl sm:block" />

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              href="/profile"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-sm font-bold text-ink transition hover:border-leaf hover:text-leaf"
            >
              <UserRound className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">マイページ</span>
            </Link>
            <Link
              href="/listings"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-leaf px-4 text-sm font-bold text-white shadow-sm transition hover:bg-green-700"
            >
              <ListPlus className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">教科書を出品する</span>
            </Link>
          </div>
        </div>
        <div className="px-4 pb-3 sm:hidden">
          <SearchBar />
        </div>
      </nav>

      <section className="border-b border-stone-200 bg-[linear-gradient(135deg,#fbfaf6_0%,#e7f7ef_48%,#fff7d8_100%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-16 lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-bold text-leaf">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              大学生向け教科書フリマ
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
                    <img src={book.cover} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-ink sm:text-3xl">
              {query ? `「${query}」の検索結果` : "今週のおすすめ教科書"}
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              {query
                ? `${textbooks.length}件見つかりました`
                : "メモ付きの出品から、次の履修にすぐ使える一冊を。"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/?${query ? `q=${encodeURIComponent(query)}&` : ""}sort=new`}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-bold transition ${sort !== "likes" ? "border-leaf bg-leaf text-white" : "border-stone-200 bg-white text-stone-600 hover:border-leaf hover:text-leaf"}`}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              新着順
            </Link>
            <Link
              href={`/?${query ? `q=${encodeURIComponent(query)}&` : ""}sort=likes`}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-bold transition ${sort === "likes" ? "border-leaf bg-leaf text-white" : "border-stone-200 bg-white text-stone-600 hover:border-leaf hover:text-leaf"}`}
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              いいね順
            </Link>
          </div>
        </div>
        {textbooks.length === 0 ? (
          <p className="py-16 text-center text-sm font-bold text-stone-400">
            「{query}」に一致する教科書が見つかりませんでした。
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {textbooks.map((textbook) => (
              <TextbookCard key={textbook.id} textbook={textbook} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
