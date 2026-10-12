"use client";

// マウスを近づけると、磁石のように少し引き寄せられるボタン（リンク）
import { useRef, type ReactNode, type PointerEvent } from "react";
import Link from "next/link";

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean; // trueなら新しいタブで開く
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const props = {
    ref,
    href,
    className: `btn btn-${variant}`,
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    children: <span className="btn-label">{children}</span>,
  };

  // 外部サイトは新しいタブで開く。サイト内のページは Link で素早く移動する
  return external ? (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ) : (
    <Link {...props} />
  );
}
