// GitHubのリポジトリを、カードの一覧として表示する部品
// ホーム（最新の数件）と作品ページ（全件）の両方で使う
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import { LabeledLink, T, UpdatedAgo } from "@/components/LanguageProvider";
import { GITHUB_URL, LANGUAGE_COLORS, type GitHubRepo } from "@/lib/github";
import styles from "@/app/page.module.css";

export default function ProjectGrid({ repos }: { repos: GitHubRepo[] }) {
  // 読み込みに失敗したときは、GitHubへのリンクだけを出す
  if (repos.length === 0) {
    return (
      <p className={styles.text}>
        <T k="projects.error" />{" "}
        <a href={GITHUB_URL} className={styles.inlineLink}><T k="projects.seeOnGithub" /></a>
      </p>
    );
  }

  return (
    <div className={styles.grid}>
      {repos.map((repo, i) => (
        <Reveal key={repo.id} delay={i * 100}>
          <TiltCard className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.folder} aria-hidden="true" />
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
  );
}
