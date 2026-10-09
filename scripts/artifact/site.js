// Artifact版で、Reactコンポーネントの動きを普通のJavaScriptで再現したもの
// （I18N という変数に翻訳辞書が入った状態で、build.py がこのファイルを埋め込む）
(function () {
  document.documentElement.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== Reveal：画面に入ったらふわっと表示（Reveal.tsx） =====
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ===== 多言語対応：言語を決めて、ページの文章を差し替える（LanguageProvider.tsx） =====
  var STORAGE_KEY = "lang";
  var codes = I18N.languages.map(function (l) { return l.code; });

  // 使う言語を決める：前回選んだ言語 → ブラウザの言語設定 → 英語
  function detectLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (codes.indexOf(saved) !== -1) return saved;
    } catch (e) { /* 保存領域が使えない環境では無視する */ }
    var prefs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < prefs.length; i++) {
      var base = String(prefs[i]).toLowerCase().split("-")[0];
      if (codes.indexOf(base) !== -1) return base;
    }
    return "en";
  }

  // 「3日前」などを、その言語の書き方で作る（dictionaries.ts の formatTimeAgo と同じ計算）
  function timeAgo(date, lang) {
    var days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    var rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
    if (days < 30) return rtf.format(-Math.max(days, 0), "day");
    return rtf.format(-Math.floor(days / 30), "month");
  }

  function applyLang(lang) {
    var dict = I18N.dictionaries[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = dict[el.getAttribute("data-i18n")];
    });
    // **太字** を <strong> にする（innerHTMLを使わず安全に組み立てる）
    document.querySelectorAll("[data-i18n-rich]").forEach(function (el) {
      el.textContent = "";
      dict[el.getAttribute("data-i18n-rich")].split("**").forEach(function (part, i) {
        if (i % 2 === 1) {
          var strong = document.createElement("strong");
          strong.textContent = part;
          el.appendChild(strong);
        } else {
          el.appendChild(document.createTextNode(part));
        }
      });
    });
    document.querySelectorAll("[data-i18n-label]").forEach(function (el) {
      el.setAttribute("aria-label", dict[el.getAttribute("data-i18n-label")]);
    });
    document.querySelectorAll("[data-i18n-updated]").forEach(function (el) {
      el.textContent = dict["projects.updated"].replace("{time}", timeAgo(el.getAttribute("data-i18n-updated"), lang));
    });
    startTyping(I18N.typingWords[lang]);
  }

  // ===== TypingText：文字を打って消してを繰り返す（TypingText.tsx） =====
  var typing = document.querySelector(".typing");
  var textNode = document.createTextNode("");
  if (typing) typing.insertBefore(textNode, typing.querySelector(".caret"));
  var typingTimer = null;

  function startTyping(words) {
    clearTimeout(typingTimer); // 前の言語のタイピングを止める
    var wordIndex = 0, text = "", deleting = false;
    textNode.textContent = "";
    if (reduceMotion) { textNode.textContent = words[0]; return; }
    var tick = function () {
      var word = words[wordIndex];
      var delay = deleting ? 45 : 90;
      if (!deleting && text === word) {
        deleting = true;
        delay = 1600; // 打ち終わったら少し待つ
      } else if (deleting && text === "") {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      } else {
        text = word.slice(0, text.length + (deleting ? -1 : 1));
        textNode.textContent = text;
      }
      typingTimer = setTimeout(tick, delay);
    };
    tick();
  }

  // ===== 言語の切り替えメニュー（LanguageSwitcher.tsx） =====
  var select = document.getElementById("lang-select");
  var currentLang = detectLang();
  if (select) {
    select.value = currentLang;
    select.addEventListener("change", function () {
      try { localStorage.setItem(STORAGE_KEY, select.value); } catch (e) { /* 保存できなくても切り替えはできる */ }
      applyLang(select.value);
    });
  }
  applyLang(currentLang);

  // ===== TiltCard：マウスに合わせて傾くカード（TiltCard.tsx） =====
  document.querySelectorAll(".tilt").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      el.style.setProperty("--rx", (0.5 - py) * 10 + "deg");
      el.style.setProperty("--ry", (px - 0.5) * 10 + "deg");
      el.style.setProperty("--mx", px * 100 + "%");
      el.style.setProperty("--my", py * 100 + "%");
    });
    el.addEventListener("pointerleave", function () {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });

  // ===== MagneticButton：マウスに引き寄せられるボタン（MagneticButton.tsx） =====
  document.querySelectorAll(".btn").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = "translate(" + x * 0.25 + "px, " + y * 0.35 + "px)";
    });
    el.addEventListener("pointerleave", function () { el.style.transform = ""; });
  });

  // ===== AnimatedBackground：舞い落ちる花びらと、きらめく光（AnimatedBackground.tsx） =====
  var canvas = document.querySelector("canvas.particles");
  var ctx = canvas && canvas.getContext("2d");
  if (!ctx) return;
  var PETAL_COLORS = [
    "rgba(232, 180, 196, 0.55)", // 桜ピンク
    "rgba(214, 160, 180, 0.45)", // くすみピンク
    "rgba(240, 212, 220, 0.7)",  // 淡いブラッシュ
    "rgba(218, 190, 140, 0.4)",  // シャンパンゴールド
  ];
  var width = 0, height = 0, petals = [], sparkles = [], time = 0;
  var mouse = { x: -9999, y: -9999 };

  function makePetal(startAbove) {
    return {
      x: Math.random() * width,
      y: startAbove ? -20 : Math.random() * height,
      size: Math.random() * 6 + 5,
      speedY: Math.random() * 0.35 + 0.2,
      sway: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    };
  }

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var petalCount = Math.min(36, Math.floor((width * height) / 32000));
    petals = [];
    for (var i = 0; i < petalCount; i++) petals.push(makePetal(false));
    var sparkleCount = Math.min(40, Math.floor((width * height) / 28000));
    sparkles = [];
    for (var j = 0; j < sparkleCount; j++) {
      sparkles.push({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 1.4 + 0.6, phase: Math.random() * Math.PI * 2,
      });
    }
  }

  // 花びらの形（2本の曲線で、先が少しとがった楕円を描く）
  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.quadraticCurveTo(p.size * 0.9, 0, 0, p.size);
    ctx.quadraticCurveTo(-p.size * 0.9, 0, 0, -p.size);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time += 0.016;
    // きらめく光：ゆっくり明るくなったり暗くなったりする
    sparkles.forEach(function (s) {
      var alpha = 0.15 + 0.45 * (0.5 + 0.5 * Math.sin(time * 1.2 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200, 165, 100, " + alpha + ")";
      ctx.fill();
    });
    petals.forEach(function (p) {
      // マウスの近くの花びらは、ふわっとよける
      var dx = p.x - mouse.x, dy = p.y - mouse.y;
      var dist = Math.hypot(dx, dy);
      if (dist < 110 && dist > 0) {
        p.x += (dx / dist) * 1.2;
        p.y += (dy / dist) * 1.2;
      }
      // 下に落ちながら、左右にゆらゆら揺れて回る
      p.y += p.speedY;
      p.x += Math.sin(time + p.phase) * p.sway;
      p.angle += p.spin;
      if (p.y > height + 20) Object.assign(p, makePetal(true));
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      drawPetal(p);
    });
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener("pointerleave", function () { mouse.x = -9999; mouse.y = -9999; });
})();
