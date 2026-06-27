"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { StudyCycleLogo } from "@/components/StudyCycleLogo";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("メールアドレスまたはパスワードが正しくありません。");
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <StudyCycleLogo size={40} className="rounded-lg shadow-sm" />
          <span className="text-xl font-black text-ink">StudyCycle</span>
        </Link>
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <h1 className="text-xl font-black text-ink">ログイン</h1>
          <p className="mt-1 text-sm text-stone-500">大学メールアドレス（.ac.jp）でログインしてください</p>
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Mail className="h-4 w-4 text-leaf" />メールアドレス
              </span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.ac.jp" required className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold outline-none transition focus:border-leaf focus:ring-4 focus:ring-green-100" />
            </label>
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Lock className="h-4 w-4 text-leaf" />パスワード
              </span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold outline-none transition focus:border-leaf focus:ring-4 focus:ring-green-100" />
            </label>
            <button type="submit" disabled={loading} className="mt-2 h-12 w-full rounded-lg bg-leaf text-sm font-black text-white transition hover:bg-green-700 disabled:bg-stone-300">
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm font-bold text-stone-500">
            アカウントをお持ちでない方は{" "}
            <Link href="/auth/register" className="text-leaf hover:underline">新規登録</Link>
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-xs font-bold text-blue-700">
          <GraduationCap className="h-4 w-4" />大学発行の .ac.jp メールアドレスが必要です
        </div>
      </div>
    </main>
  );
}
