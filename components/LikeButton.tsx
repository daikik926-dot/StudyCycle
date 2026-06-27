"use client";
import { Heart } from "lucide-react";
import { useState } from "react";

export function LikeButton({
  textbookId,
  initialCount = 0,
}: {
  textbookId: string;
  initialCount?: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const res = await fetch(`/api/likes/${textbookId}`, {
      method: liked ? "DELETE" : "POST",
    });
    if (res.ok) {
      setLiked(!liked);
      setCount((c) => liked ? c - 1 : c + 1);
    } else if (res.status === 401) {
      window.location.href = "/auth/login";
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition ${
        liked
          ? "bg-red-50 text-red-500"
          : "bg-stone-100 text-stone-400 hover:bg-red-50 hover:text-red-400"
      }`}
    >
      <Heart className={`h-3.5 w-3.5 ${liked ? "fill-red-500" : ""}`} />
      {count}
    </button>
  );
}
