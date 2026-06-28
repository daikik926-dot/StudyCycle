import { ArrowLeft, BookOpen, GraduationCap, MessageSquare, ShieldCheck, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTextbook, textbooks } from "@/lib/textbooks";
import { CompleteTransactionButton } from "@/components/CompleteTransactionButton";

type TextbookRow = {
  id: string;
  seller_id: string;
  title: string;
  author: string | null;
  course: string | null;
  professor: string | null;
  price: number;
  cover_url: string | null;
  has_senior_notes: boolean;
  condition: string | null;
  status: string;
  profiles: { display_name: string; faculty: string | null; year: number | null; is_verified: boolean } | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function fetchTextbook(id: string): Promise<TextbookRow | null> {
  // デモ用の文字列ID（uuidでない）はDBに存在しないので問い合わせない
  if (!UUID_RE.test(id)) return null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("textbooks")
      .select(`
        id, seller_id, title, author, course, professor, price,
        cover_url, has_senior_notes, condition, status,
        profiles!seller_id (display_name, faculty, year, is_verified)
      `)
      .eq("id", id)
      .single();
    if (error) return null;
    return data as TextbookRow | null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return textbooks.map((textbook) => ({ id: textbook.id }));
}

const DEFAULT_COVER = "/covers/economics.svg";

export default async function TextbookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const supabase = createClient();
    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      user = null;
    }

    const dbTextbook = await fetchTextbook(params.id);
    const demo = getTextbook(params.id);
    if (!dbTextbook && !demo) notFound();

    const isSeller = !!(dbTextbook && user && dbTextbook.seller_id === user.id);

    const title = dbTextbook?.title ?? demo?.title ?? "教科書";
    const author = dbTextbook?.author ?? demo?.author ?? "";
    const course = dbTextbook?.course ?? demo?.course ?? "";
    const professor = dbTextbook?.professor ?? demo?.professor ?? "";
    const priceRaw = dbTextbook
      ? `¥${dbTextbook.price.toLocaleString()}`
      : demo?.price ?? "";
    const condition = dbTextbook?.condition ?? demo?.condition ?? "";
    const coverSrc = dbTextbook?.cover_url || demo?.cover || DEFAULT_COVER;
    const hasSeniorNotes = dbTextbook?.has_senior_notes ?? true;
    const status = dbTextbook?.status ?? "available";
    const sellerLabel = dbTextbook?.profiles
      ? `${dbTextbook.profiles.faculty ?? ""} ${dbTextbook.profiles.year ? dbTextbook.profiles.year + "年" : ""}`.trim()
      : demo?.seller ?? "";

    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-[#0056b3] hover:bg-slate-50"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </Link>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">教科書出品</p>
              <h1 className="text-xl font-black text-slate-950">教科書詳細</h1>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[22rem_1fr]">
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3] bg-blue-50">
              <Image
                src={coverSrc}
                alt={`${title} cover`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 22rem, 100vw"
              />
            </div>
            <div className="p-5">
              <p className="text-3xl font-black text-[#0056b3]">{priceRaw}</p>
              {hasSeniorNotes && (
                <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-bold text-[#28a745]">
                  先輩メモ付き
                </p>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black text-slate-950">{title}</h2>
            {author && <p className="mt-2 text-sm font-bold text-slate-600">{author}</p>}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {course && <Info label="授業名" value={course} icon={<GraduationCap className="h-4 w-4" />} />}
              {professor && <Info label="担当教授" value={professor} icon={<UserRound className="h-4 w-4" />} />}
              {sellerLabel && <Info label="出品者" value={sellerLabel} icon={<UserRound className="h-4 w-4" />} />}
              {condition && <Info label="状態" value={condition} icon={<BookOpen className="h-4 w-4" />} />}
            </div>

            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-black text-[#0056b3]">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                安全な取引のために
              </h3>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                チャットはこの教科書出品からのみ開始できます。初回メッセージは学術利用に沿った定型文のみ送信できます。
              </p>
            </div>

            <Link
              href={`/textbooks/${params.id}/chat`}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0056b3] text-sm font-black text-white transition hover:bg-blue-800"
            >
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
              この教科書についてチャットする
            </Link>
            {isSeller && status !== "sold" && (
              <CompleteTransactionButton textbookId={params.id} />
            )}
          </section>
        </div>
      </main>
    );
  } catch (e) {
    // 原因特定のため、エラー内容を画面に表示する（デバッグ用）
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <h1 className="text-xl font-black text-red-600">詳細ページ デバッグ情報</h1>
        <pre className="mt-4 whitespace-pre-wrap break-all rounded-lg bg-white p-4 text-sm text-red-700 shadow">
          {String((e as Error)?.message ?? e)}
          {"\n\n"}
          {String((e as Error)?.stack ?? "")}
        </pre>
        <Link href="/" className="mt-6 inline-block font-bold text-[#0056b3]">トップへ戻る</Link>
      </main>
    );
  }
}

function Info({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#0056b3]">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{value}</p>
    </div>
  );
}
