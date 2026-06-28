"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, History } from "lucide-react";

type BookItem = {
  id: string;
  title: string;
  course: string | null;
  professor: string | null;
  price: number;
  status: string;
};

const STATUS_LABEL: Record<string, string> = {
  available: "出品中",
  reserved: "取引中",
  sold: "取引完了",
};

export function ProfileTabs({
  selling,
  history,
}: {
  selling: BookItem[];
  history: BookItem[];
}) {
  const [activeTab, setActiveTab] = useState<"selling" | "history">("selling");
  const shownBooks = activeTab === "selling" ? selling : history;

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4 sm:p-5">
        <h2 className="text-lg font-black text-slate-950">出品リスト</h2>
        <div className="mt-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("selling")}
            className={
              activeTab === "selling"
                ? "h-10 rounded-md bg-white text-sm font-black text-[#0056b3] shadow-sm"
                : "h-10 rounded-md text-sm font-black text-slate-500"
            }
          >
            出品中 ({selling.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={
              activeTab === "history"
                ? "h-10 rounded-md bg-white text-sm font-black text-[#0056b3] shadow-sm"
                : "h-10 rounded-md text-sm font-black text-slate-500"
            }
          >
            取引履歴 ({history.length})
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {shownBooks.length === 0 ? (
          <p className="p-6 text-center text-sm font-bold text-slate-400">
            {activeTab === "selling" ? "出品中の教科書はありません" : "取引履歴がありません"}
          </p>
        ) : (
          shownBooks.map((book) => (
            <Link
              key={book.id}
              href={`/textbooks/${book.id}`}
              className="flex items-center gap-3 p-4 transition hover:bg-slate-50 sm:p-5"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#0056b3]">
                {activeTab === "selling" ? (
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <History className="h-5 w-5" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-950">{book.title}</p>
                <p className="mt-1 truncate text-xs font-bold text-slate-500">
                  {[book.course, book.professor].filter(Boolean).join(" / ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-[#0056b3]">¥{book.price.toLocaleString()}</p>
                <p className="mt-1 text-xs font-black text-[#28a745]">
                  {STATUS_LABEL[book.status] ?? book.status}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
