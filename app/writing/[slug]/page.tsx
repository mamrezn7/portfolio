import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/content/articles";
import { caseStudies, site } from "@/content/case-studies";
import { JsonLd, articleSchema } from "@/components/JsonLd";

// Required for `output: "export"`: only the slugs below are built.
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return {};
  const url = `/writing/${slug}/`;
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: url },
    openGraph: {
      title: a.title,
      description: a.description,
      url,
      type: "article",
      publishedTime: a.published,
      authors: [site.fullName],
      siteName: site.brand,
      locale: "en_GB",
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.description },
  };
}

/** The body format is deliberately small: paragraphs, "## " headings and fenced code. */
function Body({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}(?=(?:[^`]*`{3}[^`]*`{3})*[^`]*$)/);
  return (
    <>
      {blocks.map((b, i) => {
        const block = b.trim();
        if (block.startsWith("```")) {
          const code = block.replace(/^```\w*\n?/, "").replace(/```$/, "");
          return (
            <pre key={i} className="articleCode">
              <code>{code.trimEnd()}</code>
            </pre>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="articleHeading">
              {block.slice(3)}
            </h2>
          );
        }
        return <p key={i}>{block}</p>;
      })}
    </>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const cs = caseStudies.find((c) => c.slug === a.caseSlug);
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(a.published),
  );

  return (
    <article className="wrap article">
      <header className="articleHead">
        <h1 className="heading">{a.title}</h1>
        <p className="caseByline">
          By{" "}
          <Link href="/" rel="author">
            {site.name}
          </Link>{" "}
          · <time dateTime={a.published}>{date}</time>
        </p>
      </header>
      <div className="articleBody">
        <Body text={a.body} />
        {cs ? (
          <p className="articleMore">
            The full case study, with a diagram of the flow: <Link href={`/work/${cs.slug}/`}>{cs.title}</Link>.
          </p>
        ) : null}
      </div>
      <JsonLd data={articleSchema(a)} />
    </article>
  );
}
