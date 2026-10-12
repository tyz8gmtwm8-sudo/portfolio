import type { Metadata } from "next";
import { getGitHubRepos } from "@/lib/github";
import Reveal from "@/components/Reveal";
import ProjectGrid from "@/components/ProjectGrid";
import { T } from "@/components/LanguageProvider";
import styles from "../page.module.css";

// ブラウザのタブに「Works | Seina Tsuboi」と表示される
export const metadata: Metadata = {
  title: "Works",
};

// 作品ページ（/works）：GitHubのリポジトリをすべて表示する
export default async function WorksPage() {
  const repos = await getGitHubRepos();

  return (
    <main className={styles.main}>
      <section className={`${styles.section} ${styles.pageTop}`}>
        <Reveal>
          <h1 className={styles.sectionTitle}>
            <T k="projects.title" />
          </h1>
        </Reveal>
        <ProjectGrid repos={repos} />
      </section>
    </main>
  );
}
