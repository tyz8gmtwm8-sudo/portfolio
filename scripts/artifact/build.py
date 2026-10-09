# Next.jsのサイトを、Claude の Artifact 用の「HTMLファイル1つ」にまとめるスクリプト
#
# 使い方（portfolio フォルダで実行）:
#   1. 開発サーバーを起動しておく      npm run dev
#   2. このスクリプトを実行する        python3 scripts/artifact/build.py
#   3. scripts/artifact/out/portfolio.html ができる
#
# 仕組み:
#   - 動いている開発サーバーから、できあがったページのHTMLとCSSを取ってくる
#   - Reactのプログラムは使わず、動きは site.js（普通のJavaScript）で再現する
#   - 翻訳は src/i18n/dictionaries.ts をそのまま読み込んで埋め込む

import base64
import json
import re
import subprocess
import time
import urllib.parse
import urllib.request
from pathlib import Path

HERE = Path(__file__).parent
PROJECT = HERE.parent.parent
OUT_DIR = HERE / "out"
SERVER = "http://localhost:4000"


def fetch(url: str) -> bytes:
    # 古いデータを取らないように、URLの末尾に毎回違う値を付ける
    sep = "&" if "?" in url else "?"
    with urllib.request.urlopen(f"{url}{sep}v={time.time_ns()}") as res:
        return res.read()


# --- 1. ページのHTMLとCSSを取ってくる ---
html = fetch(SERVER + "/").decode()
css_paths = re.findall(r'<link rel="stylesheet" href="(/_next/static/chunks/[^"]+\.css)"', html)
css = "\n".join(fetch(SERVER + path).decode() for path in css_paths)

# next/font が作るフォント設定（@font-face など）は使わず、Google Fonts から読み込む
css = re.sub(r"/\* \[next\]/internal/font/.*?(?=/\* \[project\])", "", css, flags=re.S)
css = re.sub(r"/\*# sourceMappingURL=.*?\*/", "", css)
css = re.sub(r"page-module___[A-Za-z0-9]+__", "p-", css)  # 長いクラス名を短くする
css += """
/* JSが動かない環境（サムネイル撮影など）でも中身が見えるようにする */
html:not(.js) .reveal { opacity: 1; transform: none; }
:root {
  --font-cormorant: "Cormorant Garamond";
  --font-shippori: "Shippori Mincho";
  --font-zen-kaku: "Zen Kaku Gothic New";
}
"""

# --- 2. 本文だけを取り出して、Next.js専用の部分を消す ---
body = html[html.index("<body>") + len("<body>"): html.index("</body>")]
body = re.sub(r"<script.*?</script>", "", body, flags=re.S)
body = re.sub(r'<div hidden="">.*?</div>', "", body, count=1, flags=re.S)
body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
body = re.sub(r"page-module___[A-Za-z0-9]+__", "p-", body)

# アバター画像はページ内に埋め込む（Artifactは外部の画像を表示できないため）
image = re.search(r'src="/_next/image\?url=([^&"]+)', body)
if image:
    avatar_url = urllib.parse.unquote(image.group(1))
    avatar = base64.b64encode(fetch(avatar_url)).decode()
    body = re.sub(r'\s(?:srcSet|srcset)="[^"]*"', "", body)
    body = re.sub(r'src="/_next/image\?[^"]*"', f'src="data:image/png;base64,{avatar}"', body)
assert "/_next/" not in body, "Next.js専用のパスが残っています"

# --- 3. 翻訳辞書を読み込む ---
i18n = subprocess.run(
    ["node", "--experimental-strip-types", "--no-warnings", "-e",
     'import("./src/i18n/dictionaries.ts").then(m => console.log(JSON.stringify({'
     'languages: m.LANGUAGES, dictionaries: m.DICTIONARIES, typingWords: m.TYPING_WORDS})))'],
    cwd=PROJECT, capture_output=True, text=True, check=True,
).stdout.strip()
json.loads(i18n)  # 正しいJSONか確認
i18n = i18n.replace("</", "<\\/")  # 文章に </script> があってもHTMLが壊れないようにする

script = "var I18N = " + i18n + ";\n" + (HERE / "site.js").read_text()

# --- 4. 1つのHTMLファイルにまとめる ---
fonts = (
    "https://fonts.googleapis.com/css2?"
    "family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500"
    "&family=Shippori+Mincho:wght@400;500;600"
    "&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
)
out = f"""<title>Seina Tsuboi Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{fonts}">
<style>
{css}
</style>
{body}
<script>
{script}
</script>
"""
OUT_DIR.mkdir(exist_ok=True)
(OUT_DIR / "portfolio.html").write_text(out)
print(f"wrote {OUT_DIR / 'portfolio.html'} ({len(out):,} bytes)")
