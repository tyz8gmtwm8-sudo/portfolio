import Link from "next/link";
import { GITHUB_URL, getGitHubRepos } from "@/lib/github";
import TypingText from "@/components/TypingText";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import ProjectGrid from "@/components/ProjectGrid";
import { LabeledLink, RichT, T } from "@/components/LanguageProvider";
import styles from "./page.module.css";

// ホームに表示する、最新の作品の数
const LATEST_COUNT = 3;

// ホームページ（/）：あいさつ・自己紹介の要約・最新の作品・お問い合わせへの案内
// サーバー側でGitHubのデータを取得してからページを作る（Server Component）
export default async function Home() {
  const repos = await getGitHubRepos();

  return (
    <main className={styles.main}>
      {/* ===== ヒーロー（最初に見える大きなエリア） ===== */}
      <section className={styles.hero}>
        <Reveal>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} aria-hidden="true" />
            <T k="hero.hello" />
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h1 className={styles.title}>
            <span className="gradient-text"><T k="hero.name" /></span>
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className={styles.subtitle}>
            <T k="hero.buildPrefix" />
            <TypingText />
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className={styles.actions}>
            <MagneticButton href="/works"><T k="hero.viewProjects" /></MagneticButton>
            <MagneticButton href={GITHUB_URL} variant="ghost" external>
              <T k="hero.githubProfile" />
            </MagneticButton>
          </div>
        </Reveal>
        <LabeledLink href="#intro" className={styles.scrollHint} labelKey="hero.scrollDown">
          <span />
        </LabeledLink>
      </section>

      {/* ===== 自己紹介（要約。詳しくは自己紹介ページへ） ===== */}
      <section id="intro" className={styles.section}>
        <Reveal>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>01.</span> <T k="about.title" />
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className={styles.text}>
            <RichT k="about.text" />
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className={styles.more}>
            <Link href="/about" className={styles.inlineLink}><T k="home.aboutMore" /></Link>
          </div>
        </Reveal>
      </section>

      {/* ===== 最新の作品（全部は作品ページへ） ===== */}
      <section className={styles.section}>
        <Reveal>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>02.</span> <T k="home.latestTitle" />
          </h2>
        </Reveal>
        <ProjectGrid repos={repos.slice(0, LATEST_COUNT)} />
        <Reveal>
          <div className={styles.more}>
            <Link href="/works" className={styles.inlineLink}><T k="home.allProjects" /></Link>
          </div>
        </Reveal>
      </section>

      {/* ===== お問い合わせへの案内 ===== */}
      <section className={styles.section}>
        <Reveal>
          <div className={styles.cta}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.num}>03.</span> <T k="home.contactTitle" />
            </h2>
            <p className={styles.text}><T k="home.contactText" /></p>
            <MagneticButton href="/contact"><T k="home.contactButton" /></MagneticButton>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
