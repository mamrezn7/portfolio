import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, site } from "@/content/case-studies";
import { Prose } from "@/components/Prose";
import { CaseDiagram } from "@/components/Diagrams";
import { BalloonFigure } from "@/components/BalloonFigure";
import { Still } from "@/components/Still";
import { JsonLd, caseStudySchema } from "@/components/JsonLd";
import { articles } from "@/content/articles";

// Required for `output: "export"`: only the slugs below are built, and any
// other path 404s at the edge instead of failing the build.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return {};
  const url = `/work/${slug}/`;
  return {
    title: cs.seoTitle ?? cs.title,
    description: cs.blurb,
    alternates: { canonical: url },
    openGraph: {
      title: cs.title,
      description: cs.blurb,
      url,
      type: "article",
      siteName: site.brand,
      locale: "en_GB",
      authors: [site.fullName],
    },
    twitter: { card: "summary_large_image", title: cs.title, description: cs.blurb },
  };
}

const sectionKey = (heading: string) => heading.toLowerCase().replace(/[^a-z]+/g, "-");

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = caseStudies.findIndex((c) => c.slug === slug);
  if (index < 0) notFound();
  const cs = caseStudies[index];
  const prev = caseStudies[(index - 1 + caseStudies.length) % caseStudies.length];
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <article className="wrap casePage">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/#work">Selected work</Link> · case study {index + 1} of {caseStudies.length}
      </nav>

      <header className="grid caseHead">
        <div className="caseHeadText">
          <h1 className="heading">{cs.title}</h1>
          <p className="caseBlurb">{cs.blurb}</p>
          <p className="caseByline">
            By{" "}
            <Link href="/" rel="author">
              {site.name}
            </Link>{" "}
            · {cs.context}
          </p>
          <ul className="stackRow" aria-label="Stack">
            {cs.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <BalloonFigure
          variant={cs.shape}
          width={800}
          height={600}
          sizes="(min-width: 860px) 40vw, 92vw"
          priority
          className="caseFig"
        >
          <figcaption>{figureLine[cs.shape]}</figcaption>
        </BalloonFigure>
      </header>

      <section className="grid caseFacts reveal" aria-label="Outcome">
        <div className="caseMetric">
          <span className="num">{cs.metric.value}</span>
          <span className="numLabel">{cs.metric.label}</span>
        </div>
        <div className="outcome">
          <h2>Outcome</h2>
          <ul>
            {cs.result.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      {cs.sections.map((section) => {
        const key = sectionKey(section.heading);
        if (section.heading === "What I would do differently") {
          return (
            <section className="field differently" key={key} aria-labelledby={key}>
              <div className="grid">
                <h2 className="caseSectionTitle" id={key}>
                  {section.heading}
                </h2>
                <div className="differentlyBody reveal">
                  {section.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </section>
          );
        }
        return (
          <section className="grid caseSection" key={key} aria-labelledby={key}>
            <h2 className="caseSectionTitle reveal" id={key}>
              {section.heading}
            </h2>
            <div className="caseBody reveal">
              <Prose paragraphs={section.body} />
            </div>
            {section.heading === "What I did" ? (
              <div className="caseDiagram reveal">
                <CaseDiagram slug={cs.slug} />
              </div>
            ) : null}
          </section>
        );
      })}

      {articles
        .filter((x) => x.caseSlug === cs.slug)
        .map((x) => (
          <p className="caseArticle" key={x.slug}>
            I wrote about the design behind this in more depth:{" "}
            <Link href={`/writing/${x.slug}/`}>{x.title}</Link>.
          </p>
        ))}

      <nav className="caseNav" aria-label="More case studies">
        {[
          { cs: prev, label: "Previous" },
          { cs: next, label: "Next" },
        ].map(({ cs: other, label }) => (
          <Link key={label} href={`/work/${other.slug}/`} className="caseNavLink reveal">
            <Still shape={other.shape} width={800} height={600} sizes="9rem" className="caseNavShape" />
            <span className="caseNavLabel">
              {label}: {other.name.split(" · ")[0]}
            </span>
            <span className="caseNavTitle">{other.title}</span>
          </Link>
        ))}
      </nav>

      <JsonLd data={caseStudySchema(cs)} />
    </article>
  );
}

const figureLine = {
  card: "The card the journey ends with.",
  database: "The queries now wait for the click.",
  bpmn: "A process diagram, extended without a fork.",
  cap: "A learning platform with three access models.",
  sparkle: "AI answers, checked before they run.",
} as const;
