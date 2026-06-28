"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-slate-900">
      <div className="text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-10 w-10 text-red-500" aria-hidden="true" />
        </div>
        <p className="text-6xl font-black text-red-500">500</p>
        <h1 className="mt-4 text-2xl font-black text-slate-950">エラーが発生しました</h1>
        <p className="mt-3 text-sm font-bold text-slate-500">
          申し訳ございません。予期しないエラーが発生しました。
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#0056b3] px-6 text-sm font-black text-white transition hover:bg-blue-800"
          >
            <RefreshCw className="h-5 w-5" aria-hidden="true" />
            もう一度試す
          </button>
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 transition hover:border-[#0056b3] hover:text-[#0056b3]"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            トップページへ
          </Link>
        </div>
      </div>
    </main>
  );
}
