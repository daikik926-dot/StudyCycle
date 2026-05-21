import { ArrowLeft, BookOpen, GraduationCap, MessageSquare, ShieldCheck, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTextbook, textbooks } from "@/lib/textbooks";

export function generateStaticParams() {
  return textbooks.map((textbook) => ({ id: textbook.id }));
}

export default function TextbookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const textbook = getTextbook(params.id);

  if (!textbook) {
    notFound();
  }

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
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Textbook Listing
            </p>
            <h1 className="text-xl font-black text-slate-950">教科書詳細</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[22rem_1fr]">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-[4/3] bg-blue-50">
            <Image
              src={textbook.cover}
              alt={`${textbook.title} cover`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 22rem, 100vw"
            />
          </div>
          <div className="p-5">
            <p className="text-3xl font-black text-[#0056b3]">{textbook.price}</p>
            <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-bold text-[#28a745]">
              {textbook.note}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-black text-slate-950">{textbook.title}</h2>
          <p className="mt-2 text-sm font-bold text-slate-600">{textbook.author}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info label="Course" value={textbook.course} icon={<GraduationCap className="h-4 w-4" />} />
            <Info label="Professor" value={textbook.professor} icon={<UserRound className="h-4 w-4" />} />
            <Info label="Seller" value={textbook.seller} icon={<UserRound className="h-4 w-4" />} />
            <Info label="Condition" value={textbook.condition} icon={<BookOpen className="h-4 w-4" />} />
          </div>

          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-black text-[#0056b3]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Safety First
            </h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
              チャットはこの教科書出品からのみ開始できます。初回メッセージは学術利用に沿った定型文のみ送信できます。
            </p>
          </div>

          <Link
            href={`/textbooks/${textbook.id}/chat`}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0056b3] text-sm font-black text-white transition hover:bg-blue-800"
          >
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
            この教科書についてチャットする
          </Link>
        </section>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
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
