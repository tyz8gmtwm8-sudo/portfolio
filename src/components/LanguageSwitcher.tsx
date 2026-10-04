"use client";

// ナビゲーションバーに置く、言語の切り替えメニュー
import { DICTIONARIES, LANGUAGES, type Lang } from "@/i18n/dictionaries";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <label className="lang-switcher">
      <span className="lang-icon" aria-hidden="true">🌐</span>
      <span className="sr-only" data-i18n="nav.language">
        {DICTIONARIES[lang]["nav.language"]}
      </span>
      <select id="lang-select" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
