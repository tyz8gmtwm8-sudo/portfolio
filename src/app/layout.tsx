import type { Metadata } from "next";
import { Cormorant_Garamond, Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import AnimatedBackground from "@/components/AnimatedBackground";
import LanguageProvider from "@/components/LanguageProvider";
import "./globals.css";

// 見出し用（英字）：細くて上品な明朝体
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// 見出し用（日本語）：やわらかい明朝体
// 日本語フォントはファイルが大きいので、先読み（preload）はしない
const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori",
  weight: ["400", "500", "600"],
  preload: false,
});

// 本文用：丸みのある読みやすいゴシック体（英字・日本語どちらも対応）
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  weight: ["400", "500", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Seina Tsuboi | 坪井聖奈 Portfolio",
  description: "My coding portfolio and the projects I'm working on.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${shipporiMincho.variable} ${zenKaku.variable}`}
    >
      <body>
        {/* 全ページ共通の動く背景 */}
        <AnimatedBackground />
        {/* 選んだ言語をサイト全体で使えるようにする */}
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
