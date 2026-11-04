/**
 * Articles published on the site. Written in the author's voice and checked
 * against the humanizer skill's patterns; every fact matches the case study
 * it links to.
 */

export type Article = {
  slug: string;
  title: string;
  description: string;
  published: string; // ISO date
  /** The case study the article expands on. */
  caseSlug: string;
  /** Markdown-light body: paragraphs, "## " headings and one ```json block. */
  body: string;
};

export const articles: Article[] = [];
