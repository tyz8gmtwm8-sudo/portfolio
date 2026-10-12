// GitHubの公開API（ログイン不要）からプロフィールとリポジトリ一覧を取得する
// 取得結果は1時間キャッシュされるので、APIの回数制限（1時間60回）にかかりにくい

export const GITHUB_USERNAME = "tyz8gmtwm8-sudo";
export const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;

// プログラミング言語ごとの色（GitHubの配色に近いもの）
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#663399",
  Python: "#3572A5",
};

export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
};

export type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
};

const API = "https://api.github.com";
const options = {
  headers: { Accept: "application/vnd.github+json" },
  next: { revalidate: 3600 }, // 3600秒 = 1時間ごとに最新データへ更新
};

export async function getGitHubUser(): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`${API}/users/${GITHUB_USERNAME}`, options);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null; // 通信エラーでもサイト全体が落ちないようにする
  }
}

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `${API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
      options,
    );
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    // フォーク（他人のリポジトリのコピー）は除外する
    return repos.filter((repo) => !repo.fork);
  } catch {
    return [];
  }
}
