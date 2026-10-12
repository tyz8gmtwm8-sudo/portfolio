"use client";

// お問い合わせフォームの画面部分（ブラウザ側で動く）
// 送信ボタンを押すと、actions.ts の sendContact がサーバーで実行される
import { useActionState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { DICTIONARIES, type DictionaryKey } from "@/i18n/dictionaries";
import { sendContact, type ContactField, type ContactState } from "./actions";
import styles from "../page.module.css";

const initialState: ContactState = { status: "idle" };

// 入力欄ごとの設定（name は送信データの名前、labelKey と errorKey は辞書のキー）
const FIELDS: { name: ContactField; labelKey: DictionaryKey; errorKey: DictionaryKey }[] = [
  { name: "name", labelKey: "contact.name", errorKey: "contact.nameError" },
  { name: "email", labelKey: "contact.email", errorKey: "contact.emailError" },
  { name: "message", labelKey: "contact.message", errorKey: "contact.messageError" },
];

// 送信結果ごとに表示する文章
const STATUS_MESSAGES: Partial<Record<ContactState["status"], DictionaryKey>> = {
  success: "contact.success",
  invalid: "contact.invalid",
  error: "contact.error",
  notConfigured: "contact.notConfigured",
};

export default function ContactForm() {
  const { lang } = useLanguage();
  const t = (key: DictionaryKey) => DICTIONARIES[lang][key];

  // state: サーバーから返ってきた結果 / formAction: 送信処理 / pending: 送信中かどうか
  const [state, formAction, pending] = useActionState(sendContact, initialState);
  const statusKey = STATUS_MESSAGES[state.status];

  return (
    <form action={formAction} className={styles.form}>
      {FIELDS.map((field) => {
        const id = `contact-${field.name}`;
        const hasError = state.errors?.includes(field.name) ?? false;
        const common = {
          id,
          name: field.name,
          required: true,
          defaultValue: state.values?.[field.name],
          "aria-invalid": hasError,
          "aria-describedby": hasError ? `${id}-error` : undefined,
        };
        return (
          <div key={field.name} className={styles.field}>
            <label htmlFor={id}>{t(field.labelKey)}</label>
            {field.name === "message" ? (
              <textarea {...common} maxLength={5000} />
            ) : (
              <input
                {...common}
                type={field.name === "email" ? "email" : "text"}
                autoComplete={field.name}
                maxLength={field.name === "email" ? 200 : 100}
              />
            )}
            {hasError && (
              <p id={`${id}-error`} className={styles.fieldError}>{t(field.errorKey)}</p>
            )}
          </div>
        );
      })}

      {/* ロボット対策の隠し入力欄。人は入力しないので、ここに値があればロボットと判断する */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className={`btn btn-primary ${styles.submitButton}`} disabled={pending}>
        <span className="btn-label">{pending ? t("contact.sending") : t("contact.send")}</span>
      </button>

      {/* 送信結果。aria-live で読み上げソフトにも伝わる */}
      <div aria-live="polite">
        {statusKey && !pending && (
          <p className={`${styles.status} ${state.status === "success" ? "" : styles.statusError}`}>
            {t(statusKey)}
          </p>
        )}
      </div>
    </form>
  );
}
