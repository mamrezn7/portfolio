import { about, caseStudies, site } from "@/content/case-studies";
import { articles } from "@/content/articles";

// Required by `output: "export"`: written once at build time as /llms.txt.
export const dynamic = "force-static";

/**
 * /llms.txt: a plain-text summary for AI assistants and answer engines, in
 * the format proposed at llmstxt.org. Built from the same content as the
 * pages, so it cannot drift from them.
 */
export function GET() {
  const lines = [
    `# ${site.name} (${site.brand})`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} (full name ${site.fullName}, also written Mohammad Reza Shirazi; online as ${site.brand}) is a ${site.role.toLowerCase()} based in ${site.location}. ${site.availability}.`,
    "",
    ...about.map((p) => `${p}\n`),
    "## Case studies",
    "",
    ...caseStudies.map((cs) => `- [${cs.title}](${site.url}/work/${cs.slug}/): ${cs.blurb} Result: ${cs.metric.value} ${cs.metric.label}.`),
    "",
    "## Writing",
    "",
    ...articles.map((a) => `- [${a.title}](${site.url}/writing/${a.slug}/): ${a.description}`),
    "",
    "## Contact",
    "",
    `- Email: ${site.email}`,
    `- LinkedIn: ${site.linkedin}`,
    `- Website: ${site.url}/`,
    `- CV: ${site.url}/cv/`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
