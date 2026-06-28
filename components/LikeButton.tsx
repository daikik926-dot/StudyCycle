"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  textbookId: string;
  initialCount: number;
  initialLiked?: boolean;
};

export function LikeButton({ textbookId, initialCount, initialLiked = false }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function toggle() {
    if (loading) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`/api/likes/${textbookId}`, { method });

      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (res.ok) {
        setLiked((prev) => !prev);
        setCount((c) => (liked ? c - 1 : c + 1));
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body.error ?? "エラーが発生しました");
      }
    } catch {
      setErrorMsg("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={toggle}
        disabled={loading}
        className={`inline-flex h-10 items-center gap-1 rounded-lg border px-3 text-sm font-bold transition disabled:opacity-50 ${
          liked
            ? "border-red-300 bg-red-50 text-red-500"
            : "border-stone-200 bg-white text-stone-400 hover:border-red-300 hover:text-red-400"
        }`}
        aria-label={liked ? "いいね取り消し" : "いいね"}
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
        <span>{count}</span>
      </button>
      {errorMsg && (
        <p className="text-xs font-bold text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}
