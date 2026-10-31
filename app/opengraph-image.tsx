import { site } from "@/content/case-studies";
import { ogImage, ogSize } from "@/components/og";

// Static export: rendered once at build time.
export const dynamic = "force-static";
export const alt = site.title;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    kicker: "mamrez.com · Senior frontend engineer",
    lines: site.headline.map((h) => ({ text: h.text, em: h.em })),
    size: 76,
    footer: `${site.name} — React and TypeScript`,
    image: "hero",
  });
}
