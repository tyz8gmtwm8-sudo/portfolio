// サイトで使う文章を、言語ごとにまとめた「翻訳辞書」
// 新しい言語を追加するときは、LANGUAGES と DICTIONARIES の両方に足す

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "es", label: "Español" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANG: Lang = "en";

// 英語版を「見本」にして、他の言語も同じ項目を持つようにする
const en = {
  "nav.about": "About",
  "nav.projects": "Projects",
  "nav.github": "GitHub",
  "nav.language": "Language",

  "hero.hello": "Hello, I'm",
  // 名前（日本語・中国語は漢字、それ以外はローマ字）
  "hero.name": "Seina Tsuboi",
  // タイピング部分の前に付く言葉（日本語などは語順が違うので空にしている）
  "hero.buildPrefix": "I build ",
  "hero.viewProjects": "View Projects →",
  "hero.githubProfile": "GitHub Profile",
  "hero.scrollDown": "Scroll down",

  "about.title": "About Me",
  // **で囲んだ部分は太字になる
  "about.text":
    "I'm a developer who loves turning ideas into real, working apps. Right now I'm focused on building with **Next.js** and **TypeScript** — from small to-do apps to a shift-scheduling system for care facilities.",

  "projects.title": "Projects I'm Working On",
  "projects.error": "Couldn't load projects right now.",
  "projects.seeOnGithub": "See them on GitHub →",
  "projects.noDescription": "No description yet — work in progress 🚧",
  // {time} の部分に「3日前」などが入る
  "projects.updated": "Updated {time}",
  "projects.liveDemo": "Live demo",
  "projects.sourceCode": "Source code",

  "github.title": "GitHub",
  "github.repos": "Repos",
  "github.followers": "Followers",
  "github.following": "Following",
  "github.follow": "Follow on GitHub",

  "footer.builtWith": "Built with Next.js & CSS",
};

export type DictionaryKey = keyof typeof en;
export type Dictionary = Record<DictionaryKey, string>;

// タイピングで順番に表示する言葉
export const TYPING_WORDS: Record<Lang, string[]> = {
  en: ["web apps.", "with Next.js.", "useful tools.", "things that feel alive."],
  ja: ["Webアプリを作っています。", "Next.jsで開発しています。", "役に立つツールを作っています。", "生きているような体験を作っています。"],
  de: ["Web-Apps.", "mit Next.js.", "nützliche Tools.", "Dinge, die lebendig wirken."],
  fr: ["des applications web.", "avec Next.js.", "des outils utiles.", "des choses vivantes."],
  it: ["app web.", "con Next.js.", "strumenti utili.", "cose che sembrano vive."],
  es: ["aplicaciones web.", "con Next.js.", "herramientas útiles.", "cosas que se sienten vivas."],
  ko: ["웹 앱을 만듭니다.", "Next.js로 개발합니다.", "유용한 도구를 만듭니다.", "살아 있는 듯한 것을 만듭니다."],
  zh: ["我开发 Web 应用。", "我用 Next.js 开发。", "我制作实用的工具。", "我创造有生命力的作品。"],
};

export const DICTIONARIES: Record<Lang, Dictionary> = {
  en,

  ja: {
    "nav.about": "自己紹介",
    "nav.projects": "プロジェクト",
    "nav.github": "GitHub",
    "nav.language": "言語",
    "hero.hello": "はじめまして、",
    "hero.name": "坪井聖奈",
    "hero.buildPrefix": "",
    "hero.viewProjects": "プロジェクトを見る →",
    "hero.githubProfile": "GitHubプロフィール",
    "hero.scrollDown": "下にスクロール",
    "about.title": "自己紹介",
    "about.text":
      "アイデアを実際に動くアプリにするのが大好きな開発者です。現在は **Next.js** と **TypeScript** を中心に、小さなToDoアプリから介護施設向けのシフト作成システムまで開発しています。",
    "projects.title": "取り組んでいるプロジェクト",
    "projects.error": "現在プロジェクトを読み込めません。",
    "projects.seeOnGithub": "GitHubで見る →",
    "projects.noDescription": "説明はまだありません — 開発中 🚧",
    "projects.updated": "更新: {time}",
    "projects.liveDemo": "デモを見る",
    "projects.sourceCode": "ソースコード",
    "github.title": "GitHub",
    "github.repos": "リポジトリ",
    "github.followers": "フォロワー",
    "github.following": "フォロー中",
    "github.follow": "GitHubでフォロー",
    "footer.builtWith": "Next.js と CSS で制作",
  },

  de: {
    "nav.about": "Über mich",
    "nav.projects": "Projekte",
    "nav.github": "GitHub",
    "nav.language": "Sprache",
    "hero.hello": "Hallo, ich bin",
    "hero.name": "Seina Tsuboi",
    "hero.buildPrefix": "Ich entwickle ",
    "hero.viewProjects": "Projekte ansehen →",
    "hero.githubProfile": "GitHub-Profil",
    "hero.scrollDown": "Nach unten scrollen",
    "about.title": "Über mich",
    "about.text":
      "Ich verwandle Ideen am liebsten in echte, funktionierende Apps. Im Moment konzentriere ich mich auf **Next.js** und **TypeScript** – von kleinen To-do-Apps bis zu einem Schichtplanungssystem für Pflegeeinrichtungen.",
    "projects.title": "Projekte, an denen ich arbeite",
    "projects.error": "Die Projekte können gerade nicht geladen werden.",
    "projects.seeOnGithub": "Auf GitHub ansehen →",
    "projects.noDescription": "Noch keine Beschreibung – in Arbeit 🚧",
    "projects.updated": "Aktualisiert {time}",
    "projects.liveDemo": "Live-Demo",
    "projects.sourceCode": "Quellcode",
    "github.title": "GitHub",
    "github.repos": "Repos",
    "github.followers": "Follower",
    "github.following": "Folge ich",
    "github.follow": "Auf GitHub folgen",
    "footer.builtWith": "Erstellt mit Next.js & CSS",
  },

  fr: {
    "nav.about": "À propos",
    "nav.projects": "Projets",
    "nav.github": "GitHub",
    "nav.language": "Langue",
    "hero.hello": "Bonjour, je suis",
    "hero.name": "Seina Tsuboi",
    "hero.buildPrefix": "Je crée ",
    "hero.viewProjects": "Voir les projets →",
    "hero.githubProfile": "Profil GitHub",
    "hero.scrollDown": "Faire défiler vers le bas",
    "about.title": "À propos de moi",
    "about.text":
      "J'adore transformer des idées en applications réelles qui fonctionnent. En ce moment, je développe surtout avec **Next.js** et **TypeScript** — de petites applications de tâches jusqu'à un système de planning d'équipes pour des établissements de soins.",
    "projects.title": "Projets en cours",
    "projects.error": "Impossible de charger les projets pour le moment.",
    "projects.seeOnGithub": "Les voir sur GitHub →",
    "projects.noDescription": "Pas encore de description — en cours de développement 🚧",
    "projects.updated": "Mis à jour {time}",
    "projects.liveDemo": "Démo en ligne",
    "projects.sourceCode": "Code source",
    "github.title": "GitHub",
    "github.repos": "Dépôts",
    "github.followers": "Abonnés",
    "github.following": "Abonnements",
    "github.follow": "Suivre sur GitHub",
    "footer.builtWith": "Réalisé avec Next.js & CSS",
  },

  it: {
    "nav.about": "Chi sono",
    "nav.projects": "Progetti",
    "nav.github": "GitHub",
    "nav.language": "Lingua",
    "hero.hello": "Ciao, sono",
    "hero.name": "Seina Tsuboi",
    "hero.buildPrefix": "Creo ",
    "hero.viewProjects": "Vedi i progetti →",
    "hero.githubProfile": "Profilo GitHub",
    "hero.scrollDown": "Scorri verso il basso",
    "about.title": "Chi sono",
    "about.text":
      "Adoro trasformare le idee in app reali e funzionanti. Al momento lavoro soprattutto con **Next.js** e **TypeScript**: da piccole app di to-do fino a un sistema di gestione dei turni per strutture di assistenza.",
    "projects.title": "Progetti in corso",
    "projects.error": "Impossibile caricare i progetti in questo momento.",
    "projects.seeOnGithub": "Guardali su GitHub →",
    "projects.noDescription": "Ancora nessuna descrizione — lavori in corso 🚧",
    "projects.updated": "Aggiornato {time}",
    "projects.liveDemo": "Demo live",
    "projects.sourceCode": "Codice sorgente",
    "github.title": "GitHub",
    "github.repos": "Repository",
    "github.followers": "Follower",
    "github.following": "Seguiti",
    "github.follow": "Segui su GitHub",
    "footer.builtWith": "Realizzato con Next.js e CSS",
  },

  es: {
    "nav.about": "Sobre mí",
    "nav.projects": "Proyectos",
    "nav.github": "GitHub",
    "nav.language": "Idioma",
    "hero.hello": "Hola, soy",
    "hero.name": "Seina Tsuboi",
    "hero.buildPrefix": "Creo ",
    "hero.viewProjects": "Ver proyectos →",
    "hero.githubProfile": "Perfil de GitHub",
    "hero.scrollDown": "Desplázate hacia abajo",
    "about.title": "Sobre mí",
    "about.text":
      "Me encanta convertir ideas en aplicaciones reales que funcionan. Ahora mismo me centro en **Next.js** y **TypeScript**: desde pequeñas apps de tareas hasta un sistema de turnos para centros de cuidado.",
    "projects.title": "Proyectos en los que trabajo",
    "projects.error": "No se pudieron cargar los proyectos en este momento.",
    "projects.seeOnGithub": "Verlos en GitHub →",
    "projects.noDescription": "Aún sin descripción — en desarrollo 🚧",
    "projects.updated": "Actualizado {time}",
    "projects.liveDemo": "Demo en vivo",
    "projects.sourceCode": "Código fuente",
    "github.title": "GitHub",
    "github.repos": "Repositorios",
    "github.followers": "Seguidores",
    "github.following": "Siguiendo",
    "github.follow": "Seguir en GitHub",
    "footer.builtWith": "Hecho con Next.js y CSS",
  },

  ko: {
    "nav.about": "소개",
    "nav.projects": "프로젝트",
    "nav.github": "GitHub",
    "nav.language": "언어",
    "hero.hello": "안녕하세요,",
    "hero.name": "Seina Tsuboi",
    "hero.buildPrefix": "",
    "hero.viewProjects": "프로젝트 보기 →",
    "hero.githubProfile": "GitHub 프로필",
    "hero.scrollDown": "아래로 스크롤",
    "about.title": "소개",
    "about.text":
      "아이디어를 실제로 동작하는 앱으로 만드는 것을 좋아하는 개발자입니다. 지금은 **Next.js**와 **TypeScript**를 중심으로 작은 할 일 앱부터 요양 시설용 근무표 작성 시스템까지 개발하고 있습니다.",
    "projects.title": "진행 중인 프로젝트",
    "projects.error": "지금은 프로젝트를 불러올 수 없습니다.",
    "projects.seeOnGithub": "GitHub에서 보기 →",
    "projects.noDescription": "아직 설명이 없습니다 — 개발 중 🚧",
    "projects.updated": "업데이트: {time}",
    "projects.liveDemo": "라이브 데모",
    "projects.sourceCode": "소스 코드",
    "github.title": "GitHub",
    "github.repos": "저장소",
    "github.followers": "팔로워",
    "github.following": "팔로잉",
    "github.follow": "GitHub에서 팔로우",
    "footer.builtWith": "Next.js와 CSS로 제작",
  },

  zh: {
    "nav.about": "关于我",
    "nav.projects": "项目",
    "nav.github": "GitHub",
    "nav.language": "语言",
    "hero.hello": "你好，我是",
    "hero.name": "坪井聖奈",
    "hero.buildPrefix": "",
    "hero.viewProjects": "查看项目 →",
    "hero.githubProfile": "GitHub 主页",
    "hero.scrollDown": "向下滚动",
    "about.title": "关于我",
    "about.text":
      "我是一名热爱把想法变成真正可用的应用的开发者。目前主要使用 **Next.js** 和 **TypeScript** 进行开发，从小型待办事项应用到面向护理机构的排班系统都有涉及。",
    "projects.title": "正在进行的项目",
    "projects.error": "暂时无法加载项目。",
    "projects.seeOnGithub": "在 GitHub 上查看 →",
    "projects.noDescription": "暂无描述 — 开发中 🚧",
    "projects.updated": "更新于{time}",
    "projects.liveDemo": "在线演示",
    "projects.sourceCode": "源代码",
    "github.title": "GitHub",
    "github.repos": "仓库",
    "github.followers": "关注者",
    "github.following": "正在关注",
    "github.follow": "在 GitHub 上关注",
    "footer.builtWith": "使用 Next.js 和 CSS 构建",
  },
};

// ブラウザの言語設定（例: "ja-JP"）から、対応している言語を選ぶ
export function pickLanguage(preferred: readonly string[]): Lang {
  for (const tag of preferred) {
    const base = tag.toLowerCase().split("-")[0];
    const match = LANGUAGES.find((l) => l.code === base);
    if (match) return match.code;
  }
  return DEFAULT_LANG;
}

// 「3日前」「昨日」などを、その言語の書き方で作る（ブラウザ標準の Intl 機能を使用）
export function formatTimeAgo(date: string, lang: Lang, now = Date.now()) {
  const days = Math.floor((now - new Date(date).getTime()) / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  if (days < 30) return rtf.format(-Math.max(days, 0), "day");
  return rtf.format(-Math.floor(days / 30), "month");
}
