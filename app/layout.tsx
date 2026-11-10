import type { Metadata, Viewport } from "next";
import { TikTok_Sans } from "next/font/google";
import Link from "next/link";
import { site } from "@/content/case-studies";
import { JsonLd, personSchema, websiteSchema } from "@/components/JsonLd";
import "./globals.css";

// One family for everything: stretched wide and heavy for the name,
// normal width for reading. The width axis is loaded so CSS can set it.
const sans = TikTok_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans",
  // "optional", not "swap": swapping re-wrapped the large type when the font
  // arrived and pushed the page down (a 0.17 layout shift). The font is
  // preloaded, so it is almost always in time anyway.
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
    { media: "(prefers-color-scheme: light)", color: "#f2f1ee" },
    { media: "(prefers-color-scheme: dark)", color: "#111214" },
  ],
};

// Static export: these are the dates of the build, so the footer says when the
// site was last revised, in both calendars.
const built = new Date();
const dateEn = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(built);
const dateFa = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric", month: "long", year: "numeric" }).format(built);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="wrap">
          <header className="runningHead">
            <Link className="wordmark" href="/">
              {site.brand}
            </Link>
            <nav className="navLinks" aria-label="Main">
              <Link href="/#work">Work</Link>
              <Link href="/writing/">Writing</Link>
              <Link href="/cv/">CV</Link>
              <Link href="/#about">About</Link>
              <Link href="#contact">Contact</Link>
            </nav>
          </header>
        </div>

        <main id="main">{children}</main>

        <footer id="contact">
          <section className="contact wrap" aria-labelledby="contact-title">
            <h2 className="contactTitle" id="contact-title">
              Write to me at <a href={`mailto:${site.email}`}>{site.email}</a>
            </h2>
            <div className="contactRow">
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
              <a href={site.linkedin} rel="me noopener" target="_blank">
                LinkedIn
              </a>
              <span>
                {site.location} · {site.timezone}
              </span>
              <span>{site.availability}</span>
            </div>
          </section>
          <div className="closing inverse">
            <div className="wrap">
              <p className="closingName wide" aria-hidden="true">
                {site.name}
              </p>
              <div className="colophon">
                <p>
                  Built with Next.js and three.js. Set in TikTok Sans. Last updated <span className="nowrap">{dateEn}</span> ·{" "}
                  <bdi lang="fa" className="nowrap">
                    {dateFa}
                  </bdi>
                  .
                </p>
                <p>
                  © {built.getFullYear()} {site.name} · {site.brand}.com
                </p>
              </div>
            </div>
          </div>
        </footer>

        <JsonLd data={[websiteSchema(), personSchema()]} />
      </body>
    </html>
  );
}
