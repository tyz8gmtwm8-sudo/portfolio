"use server";

// お問い合わせフォームの送信を受け取って、メールで届ける処理（サーバー側で動く）
// メール送信には Resend（https://resend.com）の API を使う
//
// 必要な環境変数（.env.local や Vercel の設定画面で指定する。コードには書かない）:
//   RESEND_API_KEY      … Resend の APIキー
//   CONTACT_TO_EMAIL    … お問い合わせを受け取るメールアドレス
//   CONTACT_FROM_EMAIL  … 送信元（省略時は Resend のテスト用アドレス）

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  // idle: まだ送っていない / success: 送信成功 / invalid: 入力に問題あり
  // error: 送信に失敗 / notConfigured: APIキーなどが未設定
  status: "idle" | "success" | "invalid" | "error" | "notConfigured";
  errors?: ContactField[]; // 問題があった入力欄
  // 失敗したときに入力欄へ戻すための、入力されていた内容
  // （フォームは送信後に自動で空になるため）
  values?: Record<ContactField, string>;
};

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;
// 「文字@文字.文字」の形になっているかの簡単なチェック
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // ロボット対策：人には見えない欄に何か入っていたら、送ったふりをして何もしない
  if (formData.get("website")) return { status: "success" };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const values = { name, email, message };

  // 入力チェック（ブラウザ側でもチェックしているが、サーバーでも必ず確認する）
  const errors: ContactField[] = [];
  if (!name || name.length > MAX_NAME) errors.push("name");
  if (!EMAIL_PATTERN.test(email) || email.length > MAX_EMAIL) errors.push("email");
  if (!message || message.length > MAX_MESSAGE) errors.push("message");
  if (errors.length > 0) return { status: "invalid", errors, values };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return { status: "notConfigured", values };

  try {
    // Resend の API に「このメールを送って」とお願いする（リクエスト）
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to,
        reply_to: email, // メールソフトで「返信」すると、送ってくれた人に返せる
        subject: `[Portfolio] ${name} さんからのお問い合わせ`,
        text: `お名前: ${name}\nメール: ${email}\n\n${message}`,
      }),
    });

    // 返事（レスポンス）が失敗だったら、原因をサーバーのログに残す
    if (!res.ok) {
      console.error("Resend error:", res.status, await res.text());
      return { status: "error", values };
    }
    return { status: "success" };
  } catch (err) {
    console.error("Resend request failed:", err);
    return { status: "error", values };
  }
}
