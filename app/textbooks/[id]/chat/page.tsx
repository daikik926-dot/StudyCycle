import { ArrowLeft, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TransactionChat } from "@/components/TransactionChat";
import { getTextbook, textbooks } from "@/lib/textbooks";
import { createClient } from "@/lib/supabase/server";

export function generateStaticParams() {
  return textbooks.map((textbook) => ({ id: textbook.id }));
}

export default async function TextbookChatPage({ params }: { params: { id: string } }) {
  let title = "";
  let price = "";
  let course = "";
  let sellerLabel = "";

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("textbooks")
      .select("id, title, price, course, profiles!seller_id (display_name, faculty, year)")
      .eq("id", params.id)
      .single();

    if (data) {
      title = data.title;
      price = `¥${(data.price as number).toLocaleString()}`;
      course = data.course ?? "";
      const p = (Array.isArray(data.profiles) ? data.profiles[0] : data.profiles) as { display_name: string; faculty: string | null; year: number | null } | null;
      sellerLabel = p ? `${p.faculty ?? ""} ${p.year ? p.year + "年" : ""}`.trim() : "";
    }
  } catch {}

  if (!title) {
    const demo = getTextbook(params.id);
    if (!demo) notFound();
    title = demo.title;
    price = demo.price;
    course = demo.course;
    sellerLabel = demo.seller;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link href={`/textbooks/${params.id}`} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-[#0056b3] hover:bg-slate-50" aria-label="Back to textbook detail">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />StudyCycle Transaction
            </p>
            <h1 className="truncate text-xl font-black text-slate-950">{title}</h1>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
        <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-black text-[#0056b3]"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Safety Notice</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">Recommended meetup spots: Library entrance, Univ. Co-op</p>
        </div>
        <TransactionChat textbookId={params.id} textbookTitle={title} textbookPrice={price} textbookCourse={course} sellerLabel={sellerLabel} />
      </section>
    </main>
  );
}
