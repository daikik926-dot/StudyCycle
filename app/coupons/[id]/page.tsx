"use client";

import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Copy,
  QrCode,
  ReceiptText,
  ShieldCheck,
  Store,
  TicketPercent,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

const coupons = {
  "cafe-10": {
    storeName: "学内カフェ どんぐり",
    offer: "全品10% OFF",
    serialCode: "SC-2024-X82",
    expires: "2024年7月31日まで",
    status: "利用可能",
    qr: "/coupons/qr-cafe.svg",
  },
  "bookstore-300": {
    storeName: "大学生協 書籍カウンター",
    offer: "教科書購入 ¥300 OFF",
    serialCode: "SC-BOOK-7312",
    expires: "2024年8月15日まで",
    status: "利用可能",
    qr: "/coupons/qr-bookstore.svg",
  },
} as const;

export default function CouponDisplayPage() {
  const params = useParams<{ id: string }>();
  const coupon = coupons[params.id as keyof typeof coupons];

  if (!coupon) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-4">
          <Link
            href="/profile"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0056b3] transition hover:bg-slate-50"
            aria-label="Back to profile"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              StudyCycle Reward
            </p>
            <h1 className="text-xl font-black text-slate-950">
              獲得したクーポン
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 py-6">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#0056b3_0%,#0f6fce_58%,#28a745_100%)] p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/75">
                  <TicketPercent className="h-4 w-4" aria-hidden="true" />
                  Digital Coupon
                </p>
                <h2 className="mt-4 text-2xl font-black leading-tight">
                  {coupon.offer}
                </h2>
                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-white/90">
                  <Store className="h-4 w-4" aria-hidden="true" />
                  {coupon.storeName}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-[#28a745]">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                {coupon.status}
              </span>
            </div>
          </div>

          <div className="p-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="mx-auto grid h-56 w-56 place-items-center rounded-lg border border-slate-200 bg-white p-4">
                <Image
                  src={coupon.qr}
                  alt={`${coupon.storeName} coupon QR code`}
                  width={192}
                  height={192}
                  className="h-48 w-48"
                />
              </div>
              <p className="mt-3 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                <QrCode className="h-4 w-4" aria-hidden="true" />
                QR Redemption
              </p>
            </div>

            <section className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#0056b3]">
                <Copy className="h-4 w-4" aria-hidden="true" />
                Serial Code
              </p>
              <p className="mt-3 rounded-lg bg-white px-4 py-3 text-center font-mono text-2xl font-black tracking-[0.12em] text-slate-950">
                {coupon.serialCode}
              </p>
            </section>

            <section className="mt-5 grid gap-3">
              <Instruction
                icon={<BadgeCheck className="h-5 w-5" aria-hidden="true" />}
                title="学生向け"
                body="お会計時にこの画面を店員さんに見せてください。"
              />
              <Instruction
                icon={<ReceiptText className="h-5 w-5" aria-hidden="true" />}
                title="店舗向け"
                body="コードをレジで消し込むか、QRコードを読み取ってください。"
              />
            </section>

            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
              <p className="flex items-center gap-2 text-sm font-black text-slate-950">
                <CalendarDays className="h-5 w-5 text-[#0056b3]" aria-hidden="true" />
                有効期限: {coupon.expires}
              </p>
            </div>

            <p className="mt-5 flex items-start gap-2 rounded-lg bg-green-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#28a745]" aria-hidden="true" />
              このクーポンは教科書の出品・譲渡による学生支援リワードです。第三者への転送やスクリーンショット共有は避けてください。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Instruction({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#0056b3]">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-black text-slate-950">{title}</h3>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{body}</p>
      </div>
    </div>
  );
}
