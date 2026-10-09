"use client";

// 動く背景：ふんわりした光のかたまり（CSS）＋ 舞い落ちる花びらときらめく光（canvas）
import { useEffect, useRef } from "react";

// 花びら1枚の情報
type Petal = {
  x: number;
  y: number;
  size: number;     // 大きさ
  speedY: number;   // 落ちる速さ
  sway: number;     // 左右にゆれる幅
  phase: number;    // ゆれのタイミング（花びらごとにずらす）
  angle: number;    // 傾き
  spin: number;     // 回転の速さ
  color: string;
};

// きらめく光の粒
type Sparkle = { x: number; y: number; r: number; phase: number };

const PETAL_COLORS = [
  "rgba(232, 180, 196, 0.55)", // 桜ピンク
  "rgba(214, 160, 180, 0.45)", // くすみピンク
  "rgba(240, 212, 220, 0.7)",  // 淡いブラッシュ
  "rgba(218, 190, 140, 0.4)",  // シャンパンゴールド
];

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // 「動きを減らす」設定のユーザーにはアニメーションしない
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let petals: Petal[] = [];
    let sparkles: Sparkle[] = [];
    const mouse = { x: -9999, y: -9999 };
    let frameId = 0;
    let time = 0;

    const makePetal = (startAbove: boolean): Petal => ({
      x: Math.random() * width,
      y: startAbove ? -20 : Math.random() * height,
      size: Math.random() * 6 + 5,
      speedY: Math.random() * 0.35 + 0.2,
      sway: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 画面の広さに合わせて数を決める（多すぎるとうるさいので控えめに）
      const petalCount = Math.min(36, Math.floor((width * height) / 32000));
      petals = Array.from({ length: petalCount }, () => makePetal(false));
      const sparkleCount = Math.min(40, Math.floor((width * height) / 28000));
      sparkles = Array.from({ length: sparkleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.6,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    // 花びらの形（2本の曲線で、先が少しとがった楕円を描く）
    const drawPetal = (p: Petal) => {
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
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // きらめく光：ゆっくり明るくなったり暗くなったりする
      for (const s of sparkles) {
        const alpha = 0.15 + 0.45 * (0.5 + 0.5 * Math.sin(time * 1.2 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 165, 100, ${alpha})`;
        ctx.fill();
      }

      for (const p of petals) {
        // マウスの近くの花びらは、ふわっとよける
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110 && dist > 0) {
          p.x += (dx / dist) * 1.2;
          p.y += (dy / dist) * 1.2;
        }

        // 下に落ちながら、左右にゆらゆら揺れて回る
        p.y += p.speedY;
        p.x += Math.sin(time + p.phase) * p.sway;
        p.angle += p.spin;

        // 画面の下まで落ちたら、上からまた降らせる
        if (p.y > height + 20) Object.assign(p, makePetal(true));
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        drawPetal(p);
      }

      if (!reduceMotion) frameId = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    // 画面を離れたとき（コンポーネントが消えるとき）に後片付けする
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="bg" aria-hidden="true">
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />
      <div className="grid" />
      <canvas ref={canvasRef} className="particles" />
    </div>
  );
}
