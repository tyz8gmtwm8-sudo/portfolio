import type { Metadata } from "next";
import Image from "next/image";
import {
  GITHUB_URL,
  GITHUB_USERNAME,
  LANGUAGE_COLORS,
  getGitHubRepos,
  getGitHubUser,
} from "@/lib/github";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import { RichT, T } from "@/components/LanguageProvider";
import styles from "../page.module.css";

// ブラウザのタブに「About | Seina Tsuboi」と表示される
export const metadata: Metadata = {
  title: "About",
};

const SKILLS = ["Next.js", "React", "TypeScript", "JavaScript", "HTML", "CSS", "Supabase", "Git"];

// 自己紹介ページ（/about）：自己紹介・スキル・GitHubプロフィール
export default async function AboutPage() {
  const [user, repos] = await Promise.all([getGitHubUser(), getGitHubRepos()]);

  // 使っている言語の集計（リポジトリ数）
  const languageCounts = repos.reduce<Record<string, number>>((acc, repo) => {
    if (repo.language) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
    return acc;
  }, {});
  const totalWithLanguage = Object.values(languageCounts).reduce((a, b) => a + b, 0);

  return (
    <main className={styles.main}>
      {/* ===== 自己紹介 ===== */}
      <section className={`${styles.section} ${styles.pageTop}`}>
        <Reveal>
          <h1 className={styles.sectionTitle}>
            <span className={styles.num}>01.</span> <T k="about.title" />
          </h1>
        </Reveal>
        <Reveal delay={100}>
          <p className={styles.text}>
            <RichT k="about.text" />
          </p>
        </Reveal>
        <div className={styles.skills}>
          {SKILLS.map((skill, i) => (
            <Reveal key={skill} delay={150 + i * 60}>
              <span className={styles.skill}>{skill}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== GitHubプロフィール ===== */}
      <section className={styles.section}>
        <Reveal>
          <h2 className={styles.sectionTitle}>
            <span className={styles.num}>02.</span> <T k="github.title" />
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <TiltCard className={styles.profile}>
            {user && (
              <div className={styles.avatarWrap}>
                <Image
                  src={user.avatar_url}
                  alt={`${user.login} avatar`}
                  width={96}
                  height={96}
                  className={styles.avatar}
                />
              </div>
            )}
            <div className={styles.profileBody}>
              <h3 className={styles.profileName}>
                <T k="hero.name" />
                <span className={styles.handle}>@{GITHUB_USERNAME}</span>
              </h3>
              {user?.bio && <p className={styles.text}>{user.bio}</p>}
              <div className={styles.stats}>
                <div><strong>{user?.public_repos ?? repos.length}</strong><span><T k="github.repos" /></span></div>
                <div><strong>{user?.followers ?? 0}</strong><span><T k="github.followers" /></span></div>
                <div><strong>{user?.following ?? 0}</strong><span><T k="github.following" /></span></div>
              </div>

              {/* 言語の割合バー */}
              {totalWithLanguage > 0 && (
                <>
                  <div className={styles.langBar}>
                    {Object.entries(languageCounts).map(([lang, count]) => (
                      <span
                        key={lang}
                        title={lang}
                        style={{
                          width: `${(count / totalWithLanguage) * 100}%`,
                          background: LANGUAGE_COLORS[lang] ?? "#888",
                        }}
                      />
                    ))}
                  </div>
                  <div className={styles.langLegend}>
                    {Object.entries(languageCounts).map(([lang, count]) => (
                      <span key={lang}>
                        <span className={styles.dot} style={{ background: LANGUAGE_COLORS[lang] ?? "#888" }} />
                        {lang} {Math.round((count / totalWithLanguage) * 100)}%
                      </span>
                    ))}
                  </div>
                </>
              )}

              <MagneticButton href={GITHUB_URL} external>
                <T k="github.follow" />
              </MagneticButton>
            </div>
          </TiltCard>
        </Reveal>
      </section>
    </main>
  );
}
