"use client";

// 全ページ共通のヘッダー（ロゴ・ページへのメニュー・言語切り替え）
// 今いるページのメニューには下線が付く。スマホ幅では「☰」ボタンで開閉する
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { T, useLanguage } from "@/components/LanguageProvider";
import { DICTIONARIES, type DictionaryKey } from "@/i18n/dictionaries";
import styles from "./SiteHeader.module.css";

// メニューに並べるページ（URL と、表示する言葉の辞書キー）
const PAGES: { href: string; labelKey: DictionaryKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/works", labelKey: "nav.projects" },
  { href: "/contact", labelKey: "nav.contact" },
];

export default function SiteHeader() {
  const pathname = usePathname(); // 今表示しているページのURL（例: "/about"）
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false); // スマホ用メニューが開いているか

  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
        Seina<span className={styles.logoMark} aria-hidden="true">✦</span>Tsuboi
      </Link>

      {/* スマホ幅のときだけ表示される開閉ボタン */}
      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={DICTIONARIES[lang]["nav.menu"]}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={open ? styles.barsOpen : styles.bars} aria-hidden="true" />
      </button>

      <div id="site-menu" className={`${styles.navRight} ${open ? styles.open : ""}`}>
        <nav className={styles.links}>
          {PAGES.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              // aria-current：読み上げソフトに「今いるページ」だと伝える
              aria-current={pathname === page.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              <T k={page.labelKey} />
            </Link>
          ))}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
