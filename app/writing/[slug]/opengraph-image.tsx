import { articles } from "@/content/articles";
import { site } from "@/content/case-studies";
import { ogImage, ogSize } from "@/components/og";

// Static export: one image per article, rendered at build time.
export const dynamic = "force-static";
export const dynamicParams = false;
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Article";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug) ?? articles[0];
  return ogImage({
    title: a.title,
    size: a.title.length > 44 ? 50 : 58,
    sub: "Writing",
    footer: `${site.name} · mamrez.com`,
    image: "sparkle",
  });
}
