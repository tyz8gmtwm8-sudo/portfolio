import type { Metadata } from "next";
import { Cormorant_Garamond, Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import AnimatedBackground from "@/components/AnimatedBackground";
import LanguageProvider, { T } from "@/components/LanguageProvider";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";
import styles from "./page.module.css";

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
  // 各ページで title を指定すると「About | Seina Tsuboi」のように %s の部分に入る
  title: {
    default: "Seina Tsuboi | 坪井聖奈 Portfolio",
    template: "%s | Seina Tsuboi",
  },
  description: "My coding portfolio and the projects I'm working on.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // ページ移動のときは、なめらかスクロールを一時的に止めてすぐ一番上に移動する
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${shipporiMincho.variable} ${zenKaku.variable}`}
    >
      <body>
        {/* 全ページ共通の動く背景 */}
        <AnimatedBackground />
        {/* 選んだ言語をサイト全体で使えるようにする */}
        <LanguageProvider>
          {/* 全ページ共通のヘッダー */}
          <SiteHeader />
          {children}
          {/* 全ページ共通のフッター */}
          <footer className={styles.footer}>
            <T k="footer.builtWith" /> · © {new Date().getFullYear()}
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
