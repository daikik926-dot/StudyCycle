import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-slate-900">
      <div className="text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-blue-50">
          <BookOpen className="h-10 w-10 text-[#0056b3]" aria-hidden="true" />
        </div>
        <p className="text-6xl font-black text-[#0056b3]">404</p>
        <h1 className="mt-4 text-2xl font-black text-slate-950">ページが見つかりません</h1>
        <p className="mt-3 text-sm font-bold text-slate-500">
          お探しのページは存在しないか、削除された可能性があります。
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-[#0056b3] px-6 text-sm font-black text-white transition hover:bg-blue-800"
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          トップページへ戻る
        </Link>
      </div>
    </main>
  );
}
