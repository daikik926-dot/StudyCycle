"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, Suspense } from "react";

function SearchBarInner({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <label className="relative block">
        <span className="sr-only">教科書を検索</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder="授業名・教科書名で探す"
          className="h-11 w-full rounded-lg border border-stone-200 bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-leaf focus:ring-4 focus:ring-green-100"
        />
      </label>
    </form>
  );
}

export function SearchBar({ className }: { className?: string }) {
  return (
    <Suspense>
      <SearchBarInner className={className} />
    </Suspense>
  );
}
