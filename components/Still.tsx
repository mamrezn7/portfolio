import type { ShapeKind } from "@/content/case-studies";

/**
 * Bump whenever scripts/stills.html re-renders the stills. Browsers and
 * Cloudflare cache /3d/* for a week under the same file name, so without a
 * new URL visitors keep seeing the old renders.
 */
export const STILLS_VERSION = "2026-11-02";

/**
 * srcset strings for a pre-rendered still, in both themes. Each still exists
 * at full width and at half width (scripts/stills.html renders both), so a
 * phone never downloads the desktop-sized image.
 */
export function stillSources(name: "hero" | ShapeKind) {
  const [full, half] = name === "hero" ? [960, 480] : [800, 400];
  const url = (file: string) => `/3d/${file}.webp?v=${STILLS_VERSION}`;
  const set = (theme: "light" | "dark") =>
    `${url(`${name}-${theme}-${half}`)} ${half}w, ${url(`${name}-${theme}`)} ${full}w`;
  return { light: set("light"), dark: set("dark"), src: url(`${name}-light`) };
}

/**
 * A pre-rendered still of one inflated shape, in the colours of the current
 * theme. Rendered by scripts/stills.html from the same three.js scene as the
 * live figures, so cards get the 3D look without loading any 3D.
 */
export function Still({
  shape,
  width,
  height,
  sizes,
  className,
}: {
  shape: ShapeKind;
  width: number;
  height: number;
  /** How wide the image is displayed, so the browser can pick a file. */
  sizes: string;
  className?: string;
}) {
  const s = stillSources(shape);
  return (
    <picture className={className}>
      <source srcSet={s.dark} sizes={sizes} media="(prefers-color-scheme: dark)" />
      <img src={s.src} srcSet={s.light} sizes={sizes} alt="" width={width} height={height} loading="lazy" decoding="async" />
    </picture>
  );
}
