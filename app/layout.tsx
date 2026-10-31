import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { site } from "@/content/case-studies";
import { JsonLd, personSchema, websiteSchema } from "@/components/JsonLd";
import "./globals.css";

const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  // "optional", not "swap": the fallback serif is wider, so swapping fonts
  // re-wrapped the large titles and pushed the page down (a 0.17 layout shift).
  // The font is preloaded and small, so it is almost always in time anyway.
  display: "optional",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  // Same reason as the display font: the long context lines above case-study
  // titles re-wrapped when this font replaced the fallback.
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.brand,
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    siteName: site.brand,
    locale: "en_GB",
    type: "profile",
    firstName: site.givenName,
    lastName: site.familyName,
    username: site.brand,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5efe3" },
    { media: "(prefers-color-scheme: dark)", color: "#12110f" },
  ],
};

// Static export: these are the dates of the build, so they say when the site
// was last revised, in both calendars.
const built = new Date();
const dateEn = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(built);
const dateFa = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric", month: "long", year: "numeric" }).format(built);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <a className="skip mono" href="#main">
          Skip to content
        </a>
        <div className="wrap">
          <header className="runningHead mono">
            <Link className="name" href="/">
              {site.name}
            </Link>
            <span className="dateline">
              <time dateTime={built.toISOString().slice(0, 10)}>{dateEn}</time>
              <span aria-hidden="true">·</span>
              <bdi lang="fa" className="fa">
                {dateFa}
              </bdi>
            </span>
            <nav className="navLinks" aria-label="Main">
              <Link href="/#work">Work</Link>
              <Link href="/#about">About</Link>
              <Link href="#contact">Contact</Link>
            </nav>
          </header>
        </div>

        <main id="main">{children}</main>

        <footer className="contact" id="contact">
          <div className="wrap">
            <div className="opener mono">
              <span>
                <b>05</b> Contact
              </span>
              <span>{site.availability}</span>
            </div>
            <div className="grid">
              <p className="contactTitle display">
                Write to me at <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
              <div className="contactRow">
                <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
                <a href={site.linkedin} rel="me noopener" target="_blank">
                  LinkedIn
                </a>
                <span>
                  {site.location} · {site.timezone}
                </span>
              </div>
              <p className="colophon">
                <span className="mono">This site</span>
                Built with Next.js and three.js, with an AI coding agent; I made the design calls and reviewed every
                change. Set in Instrument Serif and IBM Plex Mono. Last updated{" "}
                <span className="nowrap">{dateEn}</span> ·{" "}
                <bdi lang="fa" className="nowrap">
                  {dateFa}
                </bdi>
                .
                <span className="copyright">
                  © {built.getFullYear()} {site.name} · {site.brand}.com
                </span>
              </p>
            </div>
          </div>
        </footer>

        <JsonLd data={[websiteSchema(), personSchema()]} />
      </body>
    </html>
  );
}
