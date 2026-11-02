import { site, type CaseStudy } from "@/content/case-studies";
import type { Article } from "@/content/articles";

/**
 * schema.org structured data. Search engines read it to tie the site, the
 * person and each case study together; it renders nothing visible.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so no string in the content can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const personId = `${site.url}/#person`;

// The name people search for is the short one, so it is the primary name;
// the full legal name and every other spelling are alternates.
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: site.name,
    givenName: site.givenName,
    familyName: site.familyName,
    alternateName: site.alternateNames.filter((n) => n !== site.name),
    description: site.description,
    url: `${site.url}/`,
    image: `${site.url}${site.portrait}`,
    email: `mailto:${site.email}`,
    jobTitle: site.role,
    worksFor: { "@type": "Organization", name: site.employer },
    alumniOf: { "@type": "CollegeOrUniversity", name: site.education },
    nationality: { "@type": "Country", name: "Iran" },
    homeLocation: { "@type": "Place", name: site.location },
    address: { "@type": "PostalAddress", addressLocality: "Tehran", addressCountry: "IR" },
    knowsLanguage: ["fa", "en", "de"],
    knowsAbout: site.knowsAbout,
    sameAs: [site.linkedin],
  };
}

// The site's own name is the brand, mamrez; Google uses it as the site name
// above results, and the alternates connect it to the person.
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.brand,
    alternateName: [`${site.brand}.com`, site.name],
    inLanguage: "en",
    publisher: { "@id": personId },
    author: { "@id": personId },
  };
}

/** The home page is a profile page about the person: the type Google reads for that. */
export function profilePageSchema(modified: Date) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${site.url}/#profile`,
    url: `${site.url}/`,
    name: site.title,
    inLanguage: "en",
    dateModified: modified.toISOString(),
    isPartOf: { "@id": `${site.url}/#website` },
    mainEntity: { "@id": personId },
  };
}

/** The CV page: a profile page about the same person, alongside the home page. */
export function cvPageSchema() {
  const url = `${site.url}/cv/`;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#cv`,
    url,
    name: `Frontend Engineer CV — ${site.name}`,
    inLanguage: "en",
    dateModified: new Date().toISOString(),
    isPartOf: { "@id": `${site.url}/#website` },
    mainEntity: { "@id": personId },
  };
}

export function articleSchema(a: Article) {
  const url = `${site.url}/writing/${a.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: a.title,
    description: a.description,
    url,
    mainEntityOfPage: url,
    datePublished: a.published,
    dateModified: a.published,
    inLanguage: "en",
    author: { "@type": "Person", "@id": personId, name: site.name, url: `${site.url}/` },
    publisher: { "@id": personId },
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/work/${a.caseSlug}/#article` },
  };
}

export function caseStudySchema(cs: CaseStudy) {
  const url = `${site.url}/work/${cs.slug}/`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: cs.title,
      description: cs.blurb,
      url,
      mainEntityOfPage: url,
      image: `${url}opengraph-image`,
      inLanguage: "en",
      // Static export: the build date is the date the page last changed.
      dateModified: new Date().toISOString(),
      author: { "@type": "Person", "@id": personId, name: site.name, url: `${site.url}/` },
      publisher: { "@id": personId },
      isPartOf: { "@id": `${site.url}/#website` },
      keywords: cs.stack.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Work", item: `${site.url}/#work` },
        { "@type": "ListItem", position: 2, name: cs.title, item: url },
      ],
    },
  ];
}
