import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies } from "@/content/case-studies";
import { Prose } from "@/components/Prose";
import { CaseDiagram } from "@/components/Diagrams";

// Required for `output: "export"`: only the slugs below are built, and any
// other path 404s at the edge instead of failing the build.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: cs.title,
    description: cs.blurb,
    alternates: { canonical: `/work/${slug}/` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();

  return (
    <article>
      <header className="csHeader">
        <h1 className="display">{cs.title}</h1>
        <p className="csContext">{cs.context}</p>
        <ul className="stackRow">
          {cs.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </header>

      <div className="resultBox">
        <h2>Outcome</h2>
        <ul>
          {cs.result.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>

      {cs.sections.map((section) => (
        <section key={section.heading}>
          <div className="prose">
            <h2>{section.heading}</h2>
          </div>
          <Prose paragraphs={section.body} />
          {section.heading === "What I did" ? (
            <CaseDiagram slug={cs.slug} />
          ) : null}
        </section>
      ))}

      <Link href="/#work" className="backLink">
        ← All work
      </Link>
    </article>
  );
}
