import { site } from "@/content/case-studies";
import { ogImage, ogSize } from "@/components/og";

// Static export: rendered once at build time.
export const dynamic = "force-static";
export const alt = `Writing — ${site.name}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    title: "Writing",
    size: 86,
    sub: "Articles on frontend engineering, AI features and the data behind them.",
    footer: `${site.name} · mamrez.com/writing`,
    image: "sparkle",
  });
}
