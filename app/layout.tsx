import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyCycle",
  description: "A university textbook exchange platform.",
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
