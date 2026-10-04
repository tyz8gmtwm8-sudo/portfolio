"use client";

// 今どの言語を表示しているかを、サイト全体で共有するための仕組み（React Context）
import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANG,
  DICTIONARIES,
  LANGUAGES,
  formatTimeAgo,
  pickLanguage,
  type DictionaryKey,
  type Lang,
} from "@/i18n/dictionaries";

const STORAGE_KEY = "lang";

const LanguageContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: DEFAULT_LANG,
  setLang: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

// ===== 選んだ言語の保存場所（ブラウザの localStorage） =====
// localStorage が使えない環境（プライベートモードなど）でも動くように、メモリにも持っておく
let chosenLang: Lang | null = null;
const listeners = new Set<() => void>();

// 使う言語を決める：今回選んだ言語 → 前回選んだ言語 → ブラウザの言語設定
function readLang(): Lang {
  if (chosenLang) return chosenLang;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.some((l) => l.code === saved)) return saved as Lang;
  } catch {
    // 読めない場合は無視して、ブラウザの言語設定を使う
  }
  return pickLanguage(navigator.languages);
}

function saveLang(next: Lang) {
  chosenLang = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // 保存できなくても切り替え自体はできる
  }
  listeners.forEach((notify) => notify()); // 言語が変わったことを画面に知らせる
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  // サーバーでは英語で作り、ブラウザで表示されたあとに readLang() の言語へ切り替わる
  const lang = useSyncExternalStore(subscribe, readLang, () => DEFAULT_LANG);

  // <html lang="..."> も合わせて変える（読み上げソフトやフォント選びに使われる）
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = saveLang;

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

// 辞書の文章を表示する。例: <T k="about.title" />
// data-i18n はArtifact版（静的なHTML）でも切り替えられるようにするための目印
export function T({ k }: { k: DictionaryKey }) {
  const { lang } = useLanguage();
  return <span data-i18n={k}>{DICTIONARIES[lang][k]}</span>;
}

// **太字** を含む文章を表示する
export function RichT({ k }: { k: DictionaryKey }) {
  const { lang } = useLanguage();
  // "**" で区切ると、奇数番目が太字にしたい部分になる
  const parts = DICTIONARIES[lang][k].split("**");
  return (
    <span data-i18n-rich={k}>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </span>
  );
}

// 「3日前に更新」のような文章を、選んだ言語で表示する
export function UpdatedAgo({ date }: { date: string }) {
  const { lang } = useLanguage();
  const text = DICTIONARIES[lang]["projects.updated"].replace("{time}", formatTimeAgo(date, lang));
  return (
    <span data-i18n-updated={date} suppressHydrationWarning>
      {text}
    </span>
  );
}

// aria-label（読み上げソフト用の説明）を翻訳できるリンク
export function LabeledLink({
  labelKey,
  ...props
}: { labelKey: DictionaryKey } & ComponentProps<"a">) {
  const { lang } = useLanguage();
  return <a {...props} aria-label={DICTIONARIES[lang][labelKey]} data-i18n-label={labelKey} />;
}
