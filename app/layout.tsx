import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StudyCycle — 学内教科書フリマ",
    template: "%s | StudyCycle",
  },
  description: "授業にひもづいた教科書と先輩メモを、安心できる学内取引で受け継げます。大学生向け教科書フリマアプリ。",
  keywords: ["教科書", "フリマ", "大学生", "学内", "先輩メモ", "StudyCycle"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "StudyCycle",
    title: "StudyCycle — 学内教科書フリマ",
    description: "授業にひもづいた教科書と先輩メモを、安心できる学内取引で受け継げます。",
  },
  twitter: {
    card: "summary",
    title: "StudyCycle — 学内教科書フリマ",
    description: "授業にひもづいた教科書と先輩メモを、安心できる学内取引で受け継げます。",
  },
  icons: {
    icon: "/studycycle-icon.svg",
    apple: "/studycycle-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
