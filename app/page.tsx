import Link from "next/link";
import { about, aboutNotes, caseStudies, education, experience, site, skills } from "@/content/case-studies";
import { Prose } from "@/components/Prose";
import { CaseThumb } from "@/components/Diagrams";
import { BalloonFigure } from "@/components/BalloonFigure";
import { Still } from "@/components/Still";
import { JsonLd, profilePageSchema } from "@/components/JsonLd";
import { articles } from "@/content/articles";

const heroHrefs = site.headline.map((h) => `/work/${h.slug}/`);

export default function Home() {
  const [lead, ...rest] = caseStudies;

  return (
    <>
      <section className="hero wrap" aria-labelledby="intro">
        {/* The name is the monument and the page's h1; the role sits inside
            it so the heading says who and what in one place. */}
        <h1 className="monument" id="intro">
          <span className="monumentName wide">{site.name}</span>
          <span className="monumentRole">{site.role}: React, TypeScript and AI features</span>
        </h1>

        <div className="grid heroGrid">
          <div className="heroText">
            <p className="lede">{site.sub}</p>

            <div className="heroActions">
              <Link className="button" href={`/work/${lead.slug}/`}>
                Read the AI case study
              </Link>
              <Link href="/cv/">View CV</Link>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <p className="availability">{site.availability}. One month&rsquo;s notice.</p>

            <p className="problemsIntro">Five problems I keep meeting, each with its case study:</p>
            <ul className="problems">
              {site.headline.map((h, i) => (
                <li key={h.slug}>
                  <Link href={`/work/${h.slug}/`} className="hl" data-shape={i}>
                    {h.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <BalloonFigure
            variant="hero"
            hrefs={heroHrefs}
            width={960}
            height={1100}
            sizes="(min-width: 860px) 45vw, 92vw"
            priority
            className="balloonFig"
          >
            <figcaption>Each shape opens its case study.</figcaption>
          </BalloonFigure>
        </div>
      </section>

      <section className="inverse figuresBand" aria-label="Key figures">
        <div className="wrap">
          <ul className="figures">
            {site.proof.map((p) => (
              <li key={p.value} className="reveal">
                <span className="num">{p.value}</span>
                <span className="figLabel">{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="work wrap" id="work" aria-labelledby="work-title">
        <h2 className="heading sectionHead" id="work-title">
          Selected work
        </h2>

        <article className="grid lead">
          <div className="leadText reveal">
            <h3 className="heading">
              <Link href={`/work/${lead.slug}/`}>{lead.title}</Link>
            </h3>
            <p className="leadBlurb">{lead.blurb}</p>
            <div className="leadMetric">
              <span className="num">{lead.metric.value}</span>
              <span className="numLabel">{lead.metric.label}</span>
            </div>
            <Link className="more" href={`/work/${lead.slug}/`} aria-hidden="true" tabIndex={-1}>
              Read the case study →
            </Link>
            <p className="leadMeta">
              {lead.name} · {lead.years}
            </p>
            {articles
              .filter((x) => x.caseSlug === lead.slug)
              .map((x) => (
                <p className="leadArticle" key={x.slug}>
                  Article: <Link href={`/writing/${x.slug}/`}>{x.title}</Link>
                </p>
              ))}
          </div>
          <div className="plate reveal">
            <CaseThumb slug={lead.slug} full />
          </div>
        </article>

        <ul className="caseList">
          {rest.map((cs) => (
            <li key={cs.slug} className="reveal">
              <Link href={`/work/${cs.slug}/`} className="caseRow">
                <Still shape={cs.shape} className="caseShape" width={800} height={600} sizes="(min-width: 860px) 14vw, 9rem" />
                <div className="caseMain">
                  <h3 className="caseTitle">{cs.title}</h3>
                  <p>{cs.blurb}</p>
                </div>
                <div className="caseFigure">
                  <span className="num">{cs.metric.value}</span>
                  <span className="numLabel">{cs.metric.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="experience wrap" id="experience" aria-labelledby="experience-title">
        <div className="grid">
          <div className="expIntro">
            <h2 className="heading" id="experience-title">
              Experience
            </h2>
            <p>{education}.</p>
            <p>
              <Link href="/cv/">The full CV</Link>, with every role in detail.
            </p>
          </div>
          <ol className="roles">
            {experience.map((r) => (
              <li key={r.org + r.years} className="reveal">
                <span className="roleYears">{r.years}</span>
                <div>
                  <h3>
                    {r.role}, <span>{r.org}</span>
                  </h3>
                  <p>{r.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid skills">
          <h3 className="skillsTitle">Skills</h3>
          <dl>
            {skills.map((s) => (
              <div key={s.group} className="reveal">
                <dt>{s.group}</dt>
                <dd>{s.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="field quote" aria-label="From the case studies">
        <figure className="wrap grid">
          <blockquote className="reveal">{lead.quote}</blockquote>
          <figcaption>
            From <Link href={`/work/${lead.slug}/`}>&ldquo;{lead.title}&rdquo;</Link>
          </figcaption>
        </figure>
      </section>

      <section className="about wrap" id="about" aria-labelledby="about-title">
        <div className="grid">
          <div className="aboutSide">
            <picture>
              <source srcSet={site.portrait.replace(".jpg", ".webp")} type="image/webp" />
              <img
                src={site.portrait}
                alt={site.name}
                width={256}
                height={256}
                className="portrait"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <ul className="notes">
              <li>
                {site.fullName} in full, also written Mohammad Reza Shirazi; in Persian,{" "}
                <bdi lang="fa" dir="rtl">
                  {site.nameFa}
                </bdi>
                . Online as {site.brand}.
              </li>
              {aboutNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
          <div className="aboutText">
            <h2 className="heading" id="about-title">
              About me
            </h2>
            <Prose paragraphs={about} />
          </div>
        </div>
      </section>

      <JsonLd data={profilePageSchema(new Date())} />
    </>
  );
}
