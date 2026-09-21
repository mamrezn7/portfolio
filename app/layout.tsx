import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { site } from "@/content/case-studies";
import "./globals.css";

const display = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mamrez.com"),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.headline,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.headline,
    url: "https://mamrez.com",
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={display.variable}>
      <body>
        <div className="shell">
          <header className="siteHeader">
            <Link href="/" className="wordmark">
              {site.name}
            </Link>
            <nav className="navLinks" aria-label="Main">
              <Link href="/#work">Work</Link>
              <Link href="/#about">About</Link>
              <a href={`mailto:${site.email}`}>Email</a>
            </nav>
          </header>

          <main>{children}</main>

          <footer className="siteFooter">
            <span>
              {site.name} · {site.timezone}
            </span>
            <span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              {" · "}
              <a href={site.linkedin}>LinkedIn</a>
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
