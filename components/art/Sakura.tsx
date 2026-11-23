"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/* ═══════════════════════════════════════════════════════════════════════════
 *  SAKURA — drifting petals on a canvas.
 *
 *  Budget-first: a capped petal count (scaled down on narrow screens), one
 *  2D canvas, and the loop PAUSES when the canvas is off-screen or the tab is
 *  hidden. Under reduced motion it renders nothing at all — falling petals are
 *  exactly the ambient motion that setting exists to stop.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface Petal {
  x: number;
  y: number;
  s: number; // size
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  sway: number;
  phase: number;
  hue: number; // pink ↔ crimson
}

interface SakuraProps {
  /** Max petals at desktop width. Halved below 768px. */
  count?: number;
  className?: string;
}

export function Sakura({ count = 36, className = "" }: SakuraProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const n = window.innerWidth < 768 ? Math.ceil(count / 2) : count;
    const spawn = (anywhere: boolean): Petal => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -20,
      s: 4 + Math.random() * 6,
      vx: 0.15 + Math.random() * 0.35,
      vy: 0.35 + Math.random() * 0.55,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.03,
      sway: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random(),
    });
    const petals = Array.from({ length: n }, () => spawn(true));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.x += p.vx + Math.sin(t / 1400 + p.phase) * p.sway * 0.3;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 20 || p.x > w + 20) Object.assign(p, spawn(false));

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        // Squash on a slow cycle so the petal appears to tumble in 3D.
        ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(t / 900 + p.phase)));
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = p.hue > 0.7 ? "#E11D48" : p.hue > 0.35 ? "#F472B6" : "#FBCFE8";
        // A petal: two arcs meeting at a notched tip.
        ctx.beginPath();
        ctx.moveTo(0, -p.s);
        ctx.quadraticCurveTo(p.s * 0.9, -p.s * 0.2, 0, p.s);
        ctx.quadraticCurveTo(-p.s * 0.9, -p.s * 0.2, 0, -p.s);
        ctx.fill();
        ctx.restore();
      }
      raf = visible ? requestAnimationFrame(draw) : 0;
    };

    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);
    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, [reduce, count]);

  // Same element on server and client; reduced motion simply never draws.
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
    />
  );
}
