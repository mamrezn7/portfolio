import type { MetadataRoute } from "next";
import { site } from "@/content/case-studies";

// Required by `output: "export"`: evaluated at build time, not per request.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#f2f1ee",
    theme_color: "#f2f1ee",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
