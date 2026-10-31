import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/content/case-studies";
import { Still } from "@/components/Still";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
  // A missing page has no canonical URL; inheriting the home page's would contradict noindex.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <div className="wrap notFound">
      <div className="opener mono">
        <span>
          <b>404</b> — Not found
        </span>
      </div>
      <div className="grid">
        <div className="notFoundText">
          <h1 className="display">
            A flow that loses people. <em>This time it lost you.</em>
          </h1>
          <p>The page you asked for is not here. These are:</p>
          <ul className="notFoundLinks">
            <li>
              <Link href="/">Home</Link>
            </li>
            {caseStudies.map((cs) => (
              <li key={cs.slug}>
                <Link href={`/work/${cs.slug}/`}>{cs.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <Still shape="flow" width={800} height={600} sizes="(min-width: 860px) 40vw, 92vw" className="notFoundShape" />
      </div>
    </div>
  );
}
