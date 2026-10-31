import type { ShapeKind } from "@/content/case-studies";

/**
 * srcset strings for a pre-rendered still, in both themes. Each still exists
 * at full width and at half width (scripts/stills.html renders both), so a
 * phone never downloads the desktop-sized image.
 */
export function stillSources(name: "hero" | ShapeKind) {
  const [full, half] = name === "hero" ? [960, 480] : [800, 400];
  const set = (theme: "light" | "dark") =>
    `/3d/${name}-${theme}-${half}.webp ${half}w, /3d/${name}-${theme}.webp ${full}w`;
  return { light: set("light"), dark: set("dark"), src: `/3d/${name}-light.webp` };
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
