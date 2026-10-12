import type { Metadata } from "next";
import { GITHUB_URL } from "@/lib/github";
import Reveal from "@/components/Reveal";
import { T } from "@/components/LanguageProvider";
import ContactForm from "./ContactForm";
import styles from "../page.module.css";

// ブラウザのタブに「Contact | Seina Tsuboi」と表示される
export const metadata: Metadata = {
  title: "Contact",
};

// お問い合わせページ（/contact）
export default function ContactPage() {
  return (
    <main className={styles.main}>
      <section className={`${styles.section} ${styles.pageTop}`}>
        <Reveal>
          <h1 className={styles.sectionTitle}>
            <T k="contact.title" />
          </h1>
        </Reveal>
        <Reveal delay={100}>
          <p className={styles.text}><T k="contact.lead" /></p>
        </Reveal>
        <Reveal delay={200}>
          <ContactForm />
        </Reveal>
        <Reveal delay={300}>
          <p className={styles.text} style={{ marginTop: 40 }}>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
              <T k="contact.orGithub" />
            </a>
          </p>
        </Reveal>
      </section>
    </main>
  );
}
