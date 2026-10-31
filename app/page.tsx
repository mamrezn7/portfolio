import Link from "next/link";
import { about, aboutNotes, caseStudies, education, experience, site, skills } from "@/content/case-studies";
import { Prose } from "@/components/Prose";
import { CaseThumb } from "@/components/Diagrams";
import { BalloonFigure } from "@/components/BalloonFigure";
import { Still } from "@/components/Still";
import { JsonLd, profilePageSchema } from "@/components/JsonLd";

const heroHrefs = site.headline.map((h) => `/work/${h.slug}/`);

export default function Home() {
  const [lead, ...rest] = caseStudies;

  return (
    <>
      <div className="wrap">
        <section className="hero" aria-labelledby="intro">
          <div className="opener mono">
            <span>
              <b>01</b> Introduction
            </span>
            <span>{site.location}</span>
          </div>
          <div className="grid heroGrid">
            <div className="heroText">
              <h1 className="kicker" id="intro">
                {site.kicker}
              </h1>
              <p className="headline display">
                {site.headline.map((h, i) => (
                  <span key={h.slug}>
                    <Link href={`/work/${h.slug}/`} className="hl" data-shape={i}>
                      {h.em ? <em>{h.text}</em> : h.text}
                    </Link>{" "}
                  </span>
                ))}
              </p>
              <div className="heroBelow">
                <div className="lede">
                  <p>{site.sub}</p>
                  <ul className="contactList">
                    <li>
                      <a href={`mailto:${site.email}`}>{site.email}</a>
                    </li>
                    <li>
                      <a href={`tel:${site.phoneHref}`}>{site.phone}</a> ·{" "}
                      <a href={site.linkedin} rel="me noopener" target="_blank">
                        LinkedIn
                      </a>{" "}
                      · <a href="#experience">Experience</a>
                    </li>
                  </ul>
                </div>
                <aside className="sidenote">
                  <span className="mono">Availability</span>
                  {site.availability}. One month&rsquo;s notice.
                </aside>
              </div>
            </div>
            <BalloonFigure
              variant="hero"
              hrefs={heroHrefs}
              width={960}
              height={1100}
              sizes="(min-width: 860px) 40vw, 92vw"
              priority
              className="balloonFig"
            >
              <figcaption className="mono">Each shape opens its case study.</figcaption>
            </BalloonFigure>
          </div>
        </section>
      </div>

      <section className="band bandRust" aria-label="Key figures">
        <div className="wrap">
          <ul className="figures">
            {site.proof.map((p) => (
              <li key={p.value} className="reveal">
                <span className="num display">{p.value}</span>
                <span className="mono">{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="work" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <div className="opener mono">
            <span>
              <b>02</b> Selected work
            </span>
            <span>{caseStudies.length} case studies</span>
          </div>
          <h2 className="workTitle display" id="work-title">
            Selected work
          </h2>

          <article className="grid lead">
            <div className="leadMetric reveal">
              <span className="num display">{lead.metric.value}</span>
              <span className="mono">{lead.metric.label}</span>
            </div>
            <div className="leadText reveal">
              <span className="mono">
                {lead.name} · {lead.years}
              </span>
              <h3 className="display">
                <Link href={`/work/${lead.slug}/`}>{lead.title}</Link>
              </h3>
              <p>{lead.blurb}</p>
              <Link className="readMore mono" href={`/work/${lead.slug}/`} aria-hidden="true" tabIndex={-1}>
                Read the case study →
              </Link>
            </div>
            <div className="plate reveal">
              <CaseThumb slug={lead.slug} />
            </div>
          </article>

          <div className="wiring" aria-hidden="true">
            <span className="trunk" />
            <span className="bus" />
            <span className="drop" />
            <span className="drop" />
          </div>

          <div className="stories">
            {rest.map((cs) => (
              <article className="story reveal" key={cs.slug}>
                <div className="storyHead mono">
                  <span>{cs.name.split(" · ")[0]}</span>
                  <span>{cs.years}</span>
                </div>
                <Still shape={cs.shape} className="storyShape" width={800} height={600} sizes="(min-width: 860px) 40vw, 92vw" />
                <div className="num display">{cs.metric.value}</div>
                <div className="numLabel mono">{cs.metric.label}</div>
                <h3 className="display">
                  <Link href={`/work/${cs.slug}/`}>{cs.title}</Link>
                </h3>
                <p>{cs.blurb}</p>
                <Link className="readMore mono" href={`/work/${cs.slug}/`} aria-hidden="true" tabIndex={-1}>
                  Read →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="experience" id="experience" aria-labelledby="experience-title">
        <div className="wrap">
          <div className="opener mono">
            <span>
              <b>03</b> Experience
            </span>
            <span>2017 – now</span>
          </div>
          <div className="grid">
            <div className="expIntro">
              <h2 className="display" id="experience-title">
                Experience
              </h2>
              <p>{education}.</p>
            </div>
            <ol className="roles">
              {experience.map((r) => (
                <li key={r.org + r.years}>
                  <span className="mono roleYears">{r.years}</span>
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
            <h3 className="mono skillsTitle">Skills</h3>
            <dl>
              {skills.map((s) => (
                <div key={s.group}>
                  <dt className="mono">{s.group}</dt>
                  <dd>{s.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="band bandBlue quote" aria-label="From the case studies">
        <div className="wrap">
          <figure className="grid">
            <blockquote className="display reveal">{lead.quote}</blockquote>
            <figcaption className="mono">
              From <Link href={`/work/${lead.slug}/`}>&ldquo;{lead.title}&rdquo;</Link>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="about" id="about" aria-labelledby="about-title">
        <div className="wrap">
          <div className="opener mono">
            <span>
              <b>04</b> <span id="about-title">About {site.name}</span>
            </span>
          </div>
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
                  {site.fullName} in full; in Persian,{" "}
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
              <Prose paragraphs={about} />
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={profilePageSchema(new Date())} />
    </>
  );
}
