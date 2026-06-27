"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowUpDown } from "lucide-react";

function SortSelectorInner({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-stone-400" />
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="h-9 rounded-lg border border-stone-200 bg-white px-3 text-sm font-bold text-stone-700 outline-none focus:border-leaf focus:ring-2 focus:ring-green-100"
      >
        <option value="newest">新しい順</option>
        <option value="price_asc">価格の安い順</option>
        <option value="price_desc">価格の高い順</option>
        <option value="likes">いいねが多い順</option>
      </select>
    </div>
  );
}

export function SortSelector({ currentSort }: { currentSort: string }) {
  return (
    <Suspense fallback={null}>
      <SortSelectorInner currentSort={currentSort} />
    </Suspense>
  );
}
