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

/** Inline marks: `code`, **bold** and [text](url). Nothing nests. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("`") && p.endsWith("`") && p.length > 1) return <code key={i}>{p.slice(1, -1)}</code>;
        if (p.startsWith("**") && p.endsWith("**") && p.length > 4) return <strong key={i}>{p.slice(2, -2)}</strong>;
        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(p);
        if (link) {
          const external = /^https?:/.test(link[2]);
          return (
            <a key={i} href={link[2]} {...(external ? { rel: "noopener" } : {})}>
              {link[1]}
            </a>
          );
        }
        return p;
      })}
    </>
  );
}

/** Splits the body into blocks on blank lines, keeping fenced code whole. */
function blocksOf(text: string): string[] {
  const blocks: string[] = [];
  let current: string[] = [];
  let fenced = false;
  const flush = () => {
    if (current.length) blocks.push(current.join("\n"));
    current = [];
  };
  for (const line of text.split("\n")) {
    if (line.startsWith("```")) fenced = !fenced;
    if (!fenced && line.trim() === "" && !line.startsWith("```")) flush();
    else current.push(line);
  }
  flush();
  return blocks;
}

/**
 * The body format is deliberately small: paragraphs, "## " headings, fenced
 * code, "- " and "1. " lists, and the inline marks above.
 */
function Body({ text }: { text: string }) {
  return (
    <>
      {blocksOf(text).map((b, i) => {
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
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="articleList">
              {lines.map((l, j) => (
                <li key={j}>
                  <Inline text={l.slice(2)} />
                </li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\. /.test(l))) {
          return (
            <ol key={i} className="articleList">
              {lines.map((l, j) => (
                <li key={j}>
                  <Inline text={l.replace(/^\d+\. /, "")} />
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i}>
            <Inline text={block} />
          </p>
        );
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
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/writing/">Writing</Link> · {date}
      </nav>
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
