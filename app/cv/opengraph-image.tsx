import { site } from "@/content/case-studies";
import { ogImage, ogSize } from "@/components/og";

// Static export: rendered once at build time.
export const dynamic = "force-static";
export const alt = `Frontend Engineer CV — ${site.name}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    title: site.name,
    size: 86,
    sub: "CV: senior frontend engineer, React, TypeScript and AI features.",
    footer: "mamrez.com/cv",
    image: "hero",
  });
}
