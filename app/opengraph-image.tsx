import { site } from "@/content/case-studies";
import { ogImage, ogSize } from "@/components/og";

// Static export: rendered once at build time.
export const dynamic = "force-static";
export const alt = site.title;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    title: site.name,
    // 96 pushed the last letter of "Mohammadreza" off the 1200px card.
    size: 86,
    sub: "Senior frontend engineer: React, TypeScript and AI features.",
    footer: "mamrez.com",
    image: "hero",
  });
}
