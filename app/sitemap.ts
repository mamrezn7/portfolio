import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";

// Required by `output: "export"`: tells Next this route is evaluated at
// build time, not per request.
export const dynamic = "force-static";

const BASE = "https://mamrez.com";

/**
 * Generated at build time from the same array the routes come from, so adding
 * a case study cannot leave the sitemap stale.
 *
 * Trailing slashes match `trailingSlash: true` in next.config.mjs — a sitemap
 * that lists URLs which then redirect wastes the crawl it was meant to help.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${BASE}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudies.map((cs) => ({
      url: `${BASE}/work/${cs.slug}/`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
