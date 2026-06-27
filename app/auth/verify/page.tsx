import Link from "next/link";
import { Mail } from "lucide-react";
import { StudyCycleLogo } from "@/components/StudyCycleLogo";

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <StudyCycleLogo size={40} className="rounded-lg shadow-sm" />
          <span className="text-xl font-black text-ink">StudyCycle</span>
        </Link>
        <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-soft">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-50">
            <Mail className="h-8 w-8 text-leaf" />
          </div>
          <h1 className="mt-4 text-xl font-black text-ink">確認メールを送信しました</h1>
          <p className="mt-3 text-sm leading-7 text-stone-600">大学メールアドレスに確認メールを送りました。メール内のリンクをクリックして登録を完了してください。</p>
          <Link href="/auth/login" className="mt-6 block h-12 rounded-lg bg-leaf text-sm font-black text-white leading-[48px] transition hover:bg-green-700">ログインページへ</Link>
        </div>
      </div>
    </main>
  );
}
