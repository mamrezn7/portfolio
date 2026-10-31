import { caseStudies, site } from "@/content/case-studies";
import { ogImage, ogSize } from "@/components/og";

// Static export: one image per case study, rendered at build time.
export const dynamic = "force-static";
export const dynamicParams = false;
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Case study";

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug) ?? caseStudies[0];
  return ogImage({
    kicker: `Case study · ${cs.name}`,
    lines: [{ text: cs.title }],
    size: cs.title.length > 44 ? 64 : 76,
    metric: cs.metric,
    footer: site.name,
    image: cs.shape,
  });
}
