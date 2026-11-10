import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/content/articles";
import { site } from "@/content/case-studies";
import { JsonLd, blogSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Writing",
  description: `Articles by ${site.name} on frontend engineering.`,
  alternates: { canonical: "/writing/" },
  openGraph: {
    title: `Writing — ${site.name}`,
    url: "/writing/",
    type: "website",
    siteName: site.brand,
    locale: "en_GB",
  },
};

const dateOf = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

export default function WritingPage() {
  const list = [...articles].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <section className="wrap writing">
      <header className="articleHead">
        <h1 className="heading">Writing</h1>
        <p className="writingLead">Longer notes on problems from my work, with the details that don’t fit in a case study.</p>
      </header>
      <ol className="writingList">
        {list.map((a) => (
          <li key={a.slug}>
            <time dateTime={a.published}>{dateOf(a.published)}</time>
            <h2>
              <Link href={`/writing/${a.slug}/`}>{a.title}</Link>
            </h2>
            <p>{a.description}</p>
          </li>
        ))}
      </ol>
      <JsonLd data={blogSchema(list)} />
    </section>
  );
}
