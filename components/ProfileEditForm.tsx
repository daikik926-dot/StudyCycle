"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

const FACULTIES = [
  "法学部", "経済学部", "文学部", "理学部", "工学部",
  "医学部", "薬学部", "教育学部", "情報学部", "農学部",
  "その他",
];

const YEARS = [1, 2, 3, 4, 5, 6];

type Props = {
  initialDisplayName: string;
  initialHandle: string;
  initialFaculty: string;
  initialYear: number | null;
};

export function ProfileEditForm({ initialDisplayName, initialHandle, initialFaculty, initialYear }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [handle, setHandle] = useState(initialHandle);
  const [faculty, setFaculty] = useState(initialFaculty);
  const [year, setYear] = useState<string>(initialYear ? String(initialYear) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName.trim(),
          handle: handle.trim() || null,
          faculty: faculty || null,
          year: year ? Number(year) : null,
        }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg ?? "保存に失敗しました。");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1000);
    } catch {
      setError("ネットワークエラーが発生しました。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-bold text-green-700">保存しました。プロフィールに戻ります…</div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-900">
            表示名 <span className="text-red-500">*</span>
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            maxLength={40}
            placeholder="例: 経済学部２年のdemo"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base font-bold outline-none transition placeholder:text-slate-400 focus:border-[#0056b3] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900">ハンドル名（@）</label>
          <div className="mt-2 flex h-12 overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-[#0056b3] focus-within:ring-4 focus-within:ring-blue-100">
            <span className="grid w-10 place-items-center border-r border-slate-200 bg-slate-50 text-base font-black text-slate-600">@</span>
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
              maxLength={30}
              placeholder="例: demo_user"
              className="min-w-0 flex-1 px-4 font-bold outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900">学部</label>
          <select
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base font-bold outline-none focus:border-[#0056b3] focus:ring-4 focus:ring-blue-100"
          >
            <option value="">選択してください</option>
            {FACULTIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900">学年</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base font-bold outline-none focus:border-[#0056b3] focus:ring-4 focus:ring-blue-100"
          >
            <option value="">選択してください</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || !displayName.trim()}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0056b3] text-sm font-black text-white transition hover:bg-blue-800 disabled:bg-slate-300"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            保存中...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" aria-hidden="true" />
            保存する
          </>
        )}
      </button>
    </form>
  );
}
