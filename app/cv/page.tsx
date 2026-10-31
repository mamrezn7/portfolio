import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies, cv, experience, site, skills } from "@/content/case-studies";
import { JsonLd, cvPageSchema } from "@/components/JsonLd";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "Frontend Engineer CV",
  description:
    "CV of Mohammadreza Shirazi (Mohammad Reza Shirazi), senior frontend engineer: React, TypeScript, AI and .NET. Experience, skills and work authorisation.",
  alternates: { canonical: "/cv/" },
  openGraph: {
    title: `Frontend Engineer CV — ${site.name}`,
    url: "/cv/",
    type: "profile",
    siteName: site.brand,
    locale: "en_GB",
  },
};

export default function CvPage() {
  return (
    <article className="wrap cv">
      <header className="cvHead">
        <h1 className="heading">{site.name}</h1>
        <p className="cvRole">{site.role}: React, TypeScript and AI features</p>
        <p className="cvContact">
          <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={`tel:${site.phoneHref}`}>{site.phone}</a> ·{" "}
          <a href={site.linkedin} rel="me noopener" target="_blank">
            LinkedIn
          </a>{" "}
          · <Link href="/">{site.brand}.com</Link> · {site.location}
        </p>
        <PrintButton />
      </header>

      <section className="grid cvSection" aria-labelledby="cv-summary">
        <h2 className="cvTitle" id="cv-summary">
          Summary
        </h2>
        <p className="cvBody">{cv.summary}</p>
      </section>

      <section className="grid cvSection" aria-labelledby="cv-experience">
        <h2 className="cvTitle" id="cv-experience">
          Experience
        </h2>
        <ol className="cvBody cvRoles">
          {experience.map((r) => (
            <li key={r.org + r.years}>
              <h3>
                {r.role}, <span>{r.org}</span>
              </h3>
              <p className="cvYears">{r.years}</p>
              <ul>
                {r.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid cvSection" aria-labelledby="cv-skills">
        <h2 className="cvTitle" id="cv-skills">
          Skills
        </h2>
        <dl className="cvBody cvSkills">
          {skills.map((s) => (
            <div key={s.group}>
              <dt>{s.group}</dt>
              <dd>{s.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid cvSection" aria-labelledby="cv-work">
        <h2 className="cvTitle" id="cv-work">
          Case studies
        </h2>
        <ul className="cvBody cvLinks">
          {caseStudies.map((c) => (
            <li key={c.slug}>
              <Link href={`/work/${c.slug}/`}>{c.title}</Link> <span>· {c.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid cvSection" aria-labelledby="cv-education">
        <h2 className="cvTitle" id="cv-education">
          Education
        </h2>
        <ul className="cvBody cvPlain">
          {cv.education.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>

      <section className="grid cvSection" aria-labelledby="cv-languages">
        <h2 className="cvTitle" id="cv-languages">
          Languages
        </h2>
        <ul className="cvBody cvPlain">
          {cv.languages.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>

      <section className="grid cvSection" aria-labelledby="cv-authorisation">
        <h2 className="cvTitle" id="cv-authorisation">
          Work authorisation
        </h2>
        <p className="cvBody">{cv.authorisation}</p>
      </section>

      <JsonLd data={cvPageSchema()} />
    </article>
  );
}
