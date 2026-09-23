import Link from "next/link";
import { about, caseStudies, site } from "@/content/case-studies";
import { Prose } from "@/components/Prose";

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="heroKicker">{site.kicker}</p>
        <h1 className="display">{site.headline}</h1>
        <p className="tagline">{site.sub}</p>
        <div className="metaRow">
          <span>Working remotely, {site.timezone}</span>
          <span>{site.availability}</span>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          <a href={site.linkedin}>LinkedIn</a>
        </div>
      </section>

      <section id="work">
        <h2 className="sectionLabel">Selected work</h2>
        <ul className="workList">
          {caseStudies.map((cs) => (
            <li key={cs.slug}>
              <Link href={`/work/${cs.slug}`} className="workCard">
                <h3>{cs.title}</h3>
                <p>{cs.blurb}</p>
                <div className="context">{cs.context}</div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="about">
        <h2 className="sectionLabel">About</h2>
        <picture>
          <source srcSet="/portrait.webp" type="image/webp" />
          <img
            src="/portrait.jpg"
            alt={site.name}
            width={128}
            height={128}
            className="portrait"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <Prose paragraphs={about} />
      </section>
    </>
  );
}
