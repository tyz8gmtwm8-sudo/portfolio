import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AnimatedBackground from "@/components/AnimatedBackground";
import LanguageProvider from "@/components/LanguageProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | tyz8gmtwm8-sudo",
  description: "My coding portfolio and the projects I'm working on.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {/* 全ページ共通の動く背景 */}
        <AnimatedBackground />
        {/* 選んだ言語をサイト全体で使えるようにする */}
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
