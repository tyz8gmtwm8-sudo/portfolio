"use client";

// 動く背景：ふんわりした光のかたまり（CSS）＋ 光の中を漂う細かいちり（canvas）
import { useEffect, useRef } from "react";

// ちりの粒1つの情報
type Mote = {
  x: number;
  y: number;
  r: number;        // 大きさ
  speedY: number;   // 昇っていく速さ
  sway: number;     // 左右にゆれる幅
  phase: number;    // ゆれ・明るさのタイミング（粒ごとにずらす）
  color: string;    // 色（"r, g, b" の形。明るさは描くときに決める）
  baseAlpha: number;
};

const MOTE_COLORS = [
  "28, 26, 23",    // 黒
  "28, 26, 23",    // 黒（多めに出るよう2回入れている）
  "140, 123, 104", // トープ
  "156, 127, 85",  // 真鍮色
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
    let motes: Mote[] = [];
    const mouse = { x: -9999, y: -9999 };
    let frameId = 0;
    let time = 0;

    const makeMote = (startBelow: boolean): Mote => ({
      x: Math.random() * width,
      y: startBelow ? height + 10 : Math.random() * height,
      r: Math.random() * 1.3 + 0.4,
      speedY: Math.random() * 0.18 + 0.05,
      sway: Math.random() * 0.25 + 0.05,
      phase: Math.random() * Math.PI * 2,
      color: MOTE_COLORS[Math.floor(Math.random() * MOTE_COLORS.length)],
      baseAlpha: Math.random() * 0.25 + 0.15,
    });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 画面の広さに合わせて数を決める
      const count = Math.min(80, Math.floor((width * height) / 14000));
      motes = Array.from({ length: count }, () => makeMote(false));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      for (const m of motes) {
        // マウスの近くの粒は、ふわっとよける
        const dx = m.x - mouse.x;
        const dy = m.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100 && dist > 0) {
          m.x += (dx / dist) * 0.9;
          m.y += (dy / dist) * 0.9;
        }

        // ゆっくり上へ昇りながら、左右にかすかに揺れる
        m.y -= m.speedY;
        m.x += Math.sin(time * 0.6 + m.phase) * m.sway;

        // 画面の上まで行ったら、下からまた昇らせる
        if (m.y < -10) Object.assign(m, makeMote(true));
        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;

        // 明るさがゆっくり変わって、光の中でまたたくように見せる
        const alpha = m.baseAlpha * (0.6 + 0.4 * Math.sin(time + m.phase));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${m.color}, ${alpha})`;
        ctx.fill();
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
