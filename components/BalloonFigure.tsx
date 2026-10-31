"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ShapeKind } from "@/content/case-studies";
import { stillSources } from "./Still";

type Props = {
  /** "hero" for all four shapes, or one shape on its own. */
  variant: "hero" | ShapeKind;
  /** For the hero: where each shape goes when clicked, in HERO_LAYOUT order. */
  hrefs?: string[];
  /** The still's intrinsic size, so the image reserves its space. */
  width: number;
  height: number;
  /** How wide the still is displayed, so the browser can pick a file. */
  sizes: string;
  /** The hero still can be the largest thing in a phone's first screen. */
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/**
 * A still image of the inflated shapes, rendered from the same scene
 * (scripts/stills.html), replaced by the live three.js scene where it is worth
 * the cost: a fine pointer, a wide screen, motion allowed, WebGL available.
 * three.js is fetched only then, and only once the visitor first moves the
 * pointer, scrolls or presses a key after the page has loaded: it never
 * competes with the first paint, and nobody who just glances at the page
 * pays for it.
 *
 * For the hero, any element on the page with data-shape="<index>" (the
 * headline links) and the shape itself point at each other.
 */
export function BalloonFigure({ variant, hrefs, width, height, sizes, priority, className, children }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = stage.current;
    const cv = canvas.current;
    if (!el || !cv) return;

    const links = variant === "hero" ? [...document.querySelectorAll<HTMLElement>("[data-shape]")] : [];
    const mark = (i: number) => links.forEach((l) => l.classList.toggle("active", Number(l.dataset.shape) === i));

    const wanted = matchMedia("(min-width: 860px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

    let cancelled = false;
    let booted = false;
    let scene: { dispose(): void; setActive(i: number): void } | undefined;
    const cleanups: (() => void)[] = [];

    const boot = async () => {
      const mod = await import("./three/balloons.js");
      if (cancelled) return;
      try {
        scene = new mod.BalloonScene(cv, {
          items: variant === "hero" ? mod.HERO_LAYOUT : [mod.SOLO_POSE[variant]],
          pointerArea: el,
          onHover: (i: number) => mark(i),
          onPick: hrefs ? (i: number) => hrefs[i] && router.push(hrefs[i]) : undefined,
        });
      } catch {
        return; // no WebGL: the still stays
      }
      // Swap only once a real frame is on the canvas, so nothing flashes.
      requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute("data-live", "")));
      for (const l of links) {
        const i = Number(l.dataset.shape);
        const on = () => scene?.setActive(i);
        const off = () => scene?.setActive(-1);
        l.addEventListener("pointerenter", on);
        l.addEventListener("pointerleave", off);
        l.addEventListener("focus", on);
        l.addEventListener("blur", off);
        cleanups.push(() => {
          l.removeEventListener("pointerenter", on);
          l.removeEventListener("pointerleave", off);
          l.removeEventListener("focus", on);
          l.removeEventListener("blur", off);
        });
      }
    };

    const firstInput = ["pointermove", "pointerdown", "wheel", "keydown", "scroll"] as const;
    const onInput = () => {
      firstInput.forEach((t) => removeEventListener(t, onInput));
      void boot();
    };
    const start = () => firstInput.forEach((t) => addEventListener(t, onInput, { passive: true, once: true }));
    // Checked again on change: a window that opens narrow and is widened
    // later still gets the live scene.
    const consider = () => {
      if (booted || !wanted.matches) return;
      booted = true;
      if (document.readyState === "complete") start();
      else addEventListener("load", start, { once: true });
    };
    wanted.addEventListener("change", consider);
    consider();

    return () => {
      cancelled = true;
      wanted.removeEventListener("change", consider);
      removeEventListener("load", start);
      firstInput.forEach((t) => removeEventListener(t, onInput));
      cleanups.forEach((c) => c());
      scene?.dispose();
      mark(-1);
    };
  }, [variant, hrefs, router]);

  const still = stillSources(variant);
  return (
    <figure className={className}>
      <div className="balloonStage" ref={stage}>
        <picture>
          <source srcSet={still.dark} sizes={sizes} media="(prefers-color-scheme: dark)" />
          <img
            className="balloonStill"
            src={still.src}
            srcSet={still.light}
            sizes={sizes}
            alt=""
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        </picture>
        <canvas ref={canvas} className="balloonCanvas" aria-hidden="true" />
      </div>
      {children}
    </figure>
  );
}
