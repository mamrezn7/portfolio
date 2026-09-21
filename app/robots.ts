import type { MetadataRoute } from "next";

// Required by `output: "export"`: tells Next this route is evaluated at
// build time, not per request.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://mamrez.com/sitemap.xml",
  };
}
