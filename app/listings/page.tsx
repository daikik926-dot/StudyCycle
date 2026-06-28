import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StudyCycleLogo } from "@/components/StudyCycleLogo";
import { TextbookRegistrationForm } from "@/components/TextbookRegistrationForm";

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0056b3] transition hover:bg-slate-50"
            aria-label="ホームに戻る"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="flex items-center gap-3">
            <StudyCycleLogo size={40} className="rounded-lg shadow-sm" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                StudyCycle 出品
              </p>
              <h1 className="text-xl font-black text-slate-950 sm:text-2xl">
                教科書を出品する
              </h1>
            </div>
          </div>
        </div>
      </header>

      <TextbookRegistrationForm />
    </main>
  );
}
