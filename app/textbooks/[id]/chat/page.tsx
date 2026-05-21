import { ArrowLeft, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TransactionChat } from "@/components/TransactionChat";
import { getTextbook, textbooks } from "@/lib/textbooks";

export function generateStaticParams() {
  return textbooks.map((textbook) => ({ id: textbook.id }));
}

export default function TextbookChatPage({
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
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href={`/textbooks/${textbook.id}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-[#0056b3] hover:bg-slate-50"
            aria-label="Back to textbook detail"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              StudyCycle Transaction
            </p>
            <h1 className="truncate text-xl font-black text-slate-950">
              {textbook.title}
            </h1>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
        <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-black text-[#0056b3]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Safety Notice
          </h2>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
            Recommended meetup spots: Library entrance, Univ. Co-op
          </p>
        </div>
        <TransactionChat textbook={textbook} />
      </section>
    </main>
  );
}
