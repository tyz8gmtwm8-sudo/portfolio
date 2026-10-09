import Image from "next/image";
import {
  GITHUB_USERNAME,
  getGitHubRepos,
  getGitHubUser,
} from "@/lib/github";
import TypingText from "@/components/TypingText";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { LabeledLink, RichT, T, UpdatedAgo } from "@/components/LanguageProvider";
import styles from "./page.module.css";

const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;

// プログラミング言語ごとの色（GitHubの配色に近いもの）
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#663399",
  Python: "#3572A5",
};

const SKILLS = ["Next.js", "React", "TypeScript", "JavaScript", "HTML", "CSS", "Supabase", "Git"];

// サーバー側でGitHubのデータを取得してからページを作る（Server Component）
export default async function Home() {
  const [user, repos] = await Promise.all([getGitHubUser(), getGitHubRepos()]);

  // 使っている言語の集計（リポジトリ数）
  const languageCounts = repos.reduce<Record<string, number>>((acc, repo) => {
    if (repo.language) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
    return acc;
  }, {});
  const totalWithLanguage = Object.values(languageCounts).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* ナビゲーション */}
      <header className={styles.nav}>
        <a href="#top" className={styles.logo}>
          Seina<span className={styles.logoMark} aria-hidden="true">✦</span>Tsuboi
        </a>
        <div className={styles.navRight}>
          <nav className={styles.links}>
            <a href="#about"><T k="nav.about" /></a>
            <a href="#projects"><T k="nav.projects" /></a>
            <a href="#github"><T k="nav.github" /></a>
          </nav>
          <LanguageSwitcher />
        </div>
      </header>

      <main id="top" className={styles.main}>
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
              <MagneticButton href="#projects"><T k="hero.viewProjects" /></MagneticButton>
              <MagneticButton href={GITHUB_URL} variant="ghost" external>
                <T k="hero.githubProfile" />
              </MagneticButton>
            </div>
          </Reveal>
          <LabeledLink href="#about" className={styles.scrollHint} labelKey="hero.scrollDown">
            <span />
          </LabeledLink>
        </section>

        {/* ===== 自己紹介 ===== */}
        <section id="about" className={styles.section}>
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
          <div className={styles.skills}>
            {SKILLS.map((skill, i) => (
              <Reveal key={skill} delay={150 + i * 60}>
                <span className={styles.skill}>{skill}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===== プロジェクト一覧（GitHubから自動取得） ===== */}
        <section id="projects" className={styles.section}>
          <Reveal>
            <h2 className={styles.sectionTitle}>
              <span className={styles.num}>02.</span> <T k="projects.title" />
            </h2>
          </Reveal>

          {repos.length === 0 ? (
            <p className={styles.text}>
              <T k="projects.error" />{" "}
              <a href={GITHUB_URL} className={styles.inlineLink}><T k="projects.seeOnGithub" /></a>
            </p>
          ) : (
            <div className={styles.grid}>
              {repos.map((repo, i) => (
                <Reveal key={repo.id} delay={i * 100}>
                  <TiltCard className={styles.card}>
                    <div className={styles.cardTop}>
                      <span className={styles.folder} aria-hidden="true">✦</span>
                      <div className={styles.cardLinks}>
                        {repo.homepage && (
                          <LabeledLink href={repo.homepage} target="_blank" rel="noopener noreferrer" labelKey="projects.liveDemo">
                            ↗
                          </LabeledLink>
                        )}
                        <LabeledLink href={repo.html_url} target="_blank" rel="noopener noreferrer" labelKey="projects.sourceCode">
                          {"</>"}
                        </LabeledLink>
                      </div>
                    </div>
                    <h3 className={styles.cardTitle}>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        {repo.name}
                      </a>
                    </h3>
                    <p className={styles.cardDesc}>
                      {repo.description ?? <T k="projects.noDescription" />}
                    </p>
                    <div className={styles.cardMeta}>
                      {repo.language && (
                        <span className={styles.lang}>
                          <span
                            className={styles.dot}
                            style={{ background: LANGUAGE_COLORS[repo.language] ?? "#888" }}
                          />
                          {repo.language}
                        </span>
                      )}
                      <span>★ {repo.stargazers_count}</span>
                      <span className={styles.updated}><UpdatedAgo date={repo.updated_at} /></span>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* ===== GitHubプロフィール ===== */}
        <section id="github" className={styles.section}>
          <Reveal>
            <h2 className={styles.sectionTitle}>
              <span className={styles.num}>03.</span> <T k="github.title" />
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

      <footer className={styles.footer}>
        <T k="footer.builtWith" /> · © {new Date().getFullYear()}
      </footer>
    </>
  );
}
