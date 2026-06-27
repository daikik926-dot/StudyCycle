"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, Mail, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { StudyCycleLogo } from "@/components/StudyCycleLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.endsWith(".ac.jp")) {
      setError("大学メールアドレス（.ac.jp）のみ登録できます。");
      return;
    }
    if (password.length < 8) {
      setError("パスワードは8文字以上で設定してください。");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) {
      if (error.message === "User already registered") {
        setError("このメールアドレスはすでに登録されています。");
      } else {
        setError(`登録エラー: ${error.message}`);
      }
      setLoading(false);
      return;
    }
    router.push("/auth/verify");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <StudyCycleLogo size={40} className="rounded-lg shadow-sm" />
          <span className="text-xl font-black text-ink">StudyCycle</span>
        </Link>
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <h1 className="text-xl font-black text-ink">新規登録</h1>
          <p className="mt-1 text-sm text-stone-500">大学メールアドレス（.ac.jp）で登録してください</p>
          {error && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900"><UserRound className="h-4 w-4 text-leaf" />表示名</span>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="例: 経済学部 2年" required className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold outline-none transition focus:border-leaf focus:ring-4 focus:ring-green-100" />
            </label>
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900"><Mail className="h-4 w-4 text-leaf" />大学メールアドレス</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.ac.jp" required className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold outline-none transition focus:border-leaf focus:ring-4 focus:ring-green-100" />
            </label>
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900"><Lock className="h-4 w-4 text-leaf" />パスワード（8文字以上）</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold outline-none transition focus:border-leaf focus:ring-4 focus:ring-green-100" />
            </label>
            <button type="submit" disabled={loading} className="mt-2 h-12 w-full rounded-lg bg-leaf text-sm font-black text-white transition hover:bg-green-700 disabled:bg-stone-300">
              {loading ? "登録中..." : "アカウントを作成"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm font-bold text-stone-500">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/auth/login" className="text-leaf hover:underline">ログイン</Link>
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-xs font-bold text-blue-700">
          <GraduationCap className="h-4 w-4" />.ac.jp 以外のメールアドレスでは登録できません
        </div>
      </div>
    </main>
  );
}
