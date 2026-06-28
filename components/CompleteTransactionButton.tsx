"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

export function CompleteTransactionButton({ textbookId }: { textbookId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleComplete() {
    if (!confirm("取引を完了としてマークしますか？この操作は取り消せません。")) return;
    setLoading(true);
    const res = await fetch(`/api/textbooks/${textbookId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sold" }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      router.refresh();
    }
  }

  if (done) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-bold text-[#28a745]">
        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        取引完了としてマークしました
      </div>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-[#28a745] bg-white text-sm font-black text-[#28a745] transition hover:bg-green-50 disabled:border-slate-200 disabled:text-slate-400"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
      )}
      取引完了にする
    </button>
  );
}
