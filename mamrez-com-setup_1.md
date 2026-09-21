# mamrez.com — how it is put together

Last updated 21 September 2026. Everything here was read off the live
Cloudflare dashboard and the deployed site, not from memory.

---

## The short version

Four things, in a chain:

```
HostIran (registrar)   →   Cloudflare DNS   →   Cloudflare Pages   →   GitHub
  owns the domain          answers queries       serves the site       holds the code
                           for mamrez.com        and builds it
```

You changed the nameservers at HostIran to point at Cloudflare. Cloudflare now
answers every DNS question about mamrez.com. Two of those answers point at a
Pages project, and that Pages project builds itself from your GitHub repo every
time you push to `main`.

Nothing runs on a server you rent. There is no server to restart, no deploy
command to run, no SSH anywhere.

---

## The identifiers you will need

| Thing | Value |
|---|---|
| Cloudflare account ID | `86f5312e06927d47b79b5e75c2e184c0` |
| Zone ID (mamrez.com) | `4e7dd97cb8c83c35dc294061fb68e889` |
| Plan | Free |
| Nameservers | `tess.ns.cloudflare.com`, `trevor.ns.cloudflare.com` |
| Registrar | HostIran — was `ns1.hostiran.net` / `ns2.hostiran.net` |
| Pages project | `mamrez` → `mamrez.pages.dev` |
| Repository | `mamrezn7/portfolio` (private), branch `main` |

Do not change the nameservers at HostIran again. If they ever revert, the site
and the email both stop working within the TTL, and the first symptom is a
certificate warning rather than an obvious outage.

---

## Deploying a change

**Build locally before you push. Every time.**

```bash
npm install     # once
npm run build   # ~20 seconds; catches everything Cloudflare would catch
git add -A
git commit -m "what changed"
git push
```

`npm run build` runs the identical command Cloudflare runs, including the
TypeScript check. Three deployments failed on 21 September purely because
changes went to GitHub without being built first. If the local build is clean,
the deploy will be too.

Pushing to `main` triggers a build on Cloudflare. It takes about a minute. When
it succeeds, mamrez.com serves the new version — no extra step.

**Build settings** (Workers & Pages → mamrez → Settings → Build):

| Setting | Value |
|---|---|
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npx next build` |
| Build output directory | `out` |
| Production branch | `main` |

The site is a **static export**. `next.config.mjs` sets `output: "export"`, so
`next build` writes plain HTML into `out/` and Cloudflare serves those files.
This means: no server-side rendering, no API routes, no `getServerSideProps`,
no image optimisation at request time. If you add a feature that needs a
server, the build will fail and you will need a different hosting mode.

### When a build fails

Workers & Pages → mamrez → Deployments. A failed build shows **"No deployment
available"** instead of a URL, and the previous successful deployment keeps
serving. That is the important part: **a broken build cannot take the site
down.** It only means your change is not live.

Failed deployments stay in the list. Read down from the top — the newest row is
the current state, not the first red one you see.

Click **Details** on the failed row, then the **Build log**. The error is
almost always in the last twenty lines. Both real failures so far were
TypeScript errors: `next build` type-checks, so a type error fails the build
even when the code would run fine in a browser.

### Rolling back

Deployments → find the last good one → **Manage deployment** → rollback.
Instant, and it does not touch the repo — so the code and the live site will
disagree until you fix the code properly.

---

## DNS

Domains → mamrez.com → DNS → Records.

| Name | Type | Content | Proxy |
|---|---|---|---|
| `mamrez.com` | CNAME | `mamrez.pages.dev` | Proxied |
| `www.mamrez.com` | CNAME | `mamrez.pages.dev` | Proxied |
| `mamrez.com` | MX | `route1.mx.cloudflare.net` (priority 36) | — |
| `mamrez.com` | MX | `route2.mx.cloudflare.net` (priority 87) | — |
| `mamrez.com` | MX | `route3.mx.cloudflare.net` (priority 28) | — |
| `mamrez.com` | TXT | SPF — `v=spf1 include:_spf.mx.cloudflare.net …` | — |
| `cf2024-1._domainkey` | TXT | DKIM public key | — |

The two CNAMEs were created by Pages when you added the custom domains, and the
five mail records by Email Routing. Cloudflare marks them **Locked**, meaning
it manages them. Do not hand-edit those — change the feature that owns them.

**Proxied** (the orange cloud) means traffic passes through Cloudflare rather
than resolving straight to the origin. Keep it on. It is what gives you the
certificate, caching and DDoS protection.

---

## Email

Email Routing is **receiving only**. Cloudflare routes mail *in*; it will never
send mail *out* as you.

| Rule | Action | Status |
|---|---|---|
| `shirazi@mamrez.com` | → `mrz_shirazi@yahoo.com` | Active |
| Catch-all | Drop | **Disabled** |

Catch-all is deliberately off. With it on, every address at the domain would
accept mail and spammers would find it. Anything other than `shirazi@` bounces.

The **Email** link in the site header is a `mailto:` link. It opens the
visitor's default mail client with a blank message to you. On a machine with no
mail client configured it does nothing at all, and webmail users often get an
app they did not want — which is why the address also appears as plain text in
the hero and the footer, where it can be copied.

### Adding another address

Email Routing → Routing rules → Create routing rule. Pattern on the left,
`mamrez.com` on the right, action "Send to an email", pick the destination.
About thirty seconds, and no DNS change.

### Before you can send as shirazi@mamrez.com

You need a real mailbox provider — Zoho, Fastmail, Migadu, Google Workspace.
Two things matter when you set one up:

1. **Merge SPF, never duplicate it.** You already have one SPF TXT record. The
   provider will ask you to add theirs. Publishing a *second* SPF record makes
   the domain permanently fail SPF at every receiver — the spec allows exactly
   one. Combine the includes into the existing record instead:
   `v=spf1 include:_spf.mx.cloudflare.net include:<theirs> ~all`
2. **Their MX records will replace Cloudflare's.** Mail can be delivered to
   only one system. Once MX points at a real provider, Email Routing stops
   receiving your mail and the forwarding rule above becomes irrelevant.

There is still **no DMARC record**. Add one as `_dmarc.mamrez.com` TXT with
`v=DMARC1; p=none; rua=mailto:shirazi@mamrez.com` before you start sending —
`p=none` only monitors, it cannot cause mail to be rejected.

### Test both directions before putting the address on your CV

Send to it from another account and confirm arrival. Later, once sending works,
reply to a Gmail address and check the headers say `dkim=pass` and `spf=pass`.
A new domain with no authentication goes to spam silently.

---

## SEO

| Piece | Where it lives | What it does |
|---|---|---|
| `sitemap.xml` | `app/sitemap.ts` | Generated at build from the `caseStudies` array — adding a case study cannot leave it stale. URLs carry trailing slashes to match `trailingSlash: true`. |
| `robots.txt` | `app/robots.ts` | Allows all crawlers, points at the sitemap. |
| Canonical URLs | `app/layout.tsx` and `app/work/[slug]/page.tsx` | Declares `mamrez.com` as the real address of every page. |
| Meta description | `site.description` in `content/case-studies.ts` | 145 characters, says "frontend engineer" and names the stack. |

**Why canonicals matter here specifically.** The site answers on both
`mamrez.com` and `mamrez.pages.dev`. To a search engine that is duplicate
content competing with itself, splitting whatever ranking you earn. The
canonical tag tells it which one counts.

**The description is deliberately not the headline.** The headline is four
fragments about problems; as a search snippet it never says what you do. The
description exists so that someone searching your name sees "Frontend engineer,
React and TypeScript" under the title.

**After the next deploy:** confirm `https://mamrez.com/sitemap.xml` returns
XML, then submit it in Google Search Console. A new domain with no inbound
links will not get indexed quickly on its own, and Search Console is also where
you will see whether anyone is finding you by name.

One known quirk: `trailingSlash: true` sometimes interferes with where Next
emits `sitemap.xml` and `robots.txt` in a static export. Check `out/` after a
local build. If they are not at the root, the fallback is to delete
`app/sitemap.ts` and `app/robots.ts` and drop static copies into `public/`
instead, which is immune to the problem but needs manual updating.

---

## Things worth knowing

**`mamrez.pages.dev` is permanent and public.** Every Pages project gets one
and the Free plan gives no way to remove it. Harmless now that canonical tags
point at the apex, but be aware it exists.

**Cloudflare's GitHub app has write access** to `mamrezn7/portfolio` —
administration, checks, code, deployments and pull requests. That is the fixed
permission set for the app; there is no narrower option. It is scoped to that
one repository. To revoke: GitHub → Settings → Applications → Cloudflare
Workers and Pages.

**The dashboard sometimes fails its own bot check** from certain networks,
showing "There was a problem with verification." Reloading usually clears it;
switching VPN exit node clears it reliably.

**Dark mode.** The site respects `prefers-color-scheme`. Anything you add
should use the CSS custom properties in `app/globals.css` rather than
hard-coded colours, or it will look wrong for half your visitors. The SVG
diagrams follow this rule — they carry no colour of their own.

---

## Where things live in the repo

```
app/
  layout.tsx            shell, fonts, metadata, canonical, header, footer
  page.tsx              home: hero, work list, about
  work/[slug]/page.tsx  case study template
  sitemap.ts            generates sitemap.xml at build
  robots.ts             generates robots.txt at build
  globals.css           all styling, including the diagram classes
components/
  Prose.tsx             paragraph renderer
  Diagrams.tsx          the four inline-SVG mechanism diagrams
content/
  case-studies.ts       every word on the site, plus site-wide fields
```

To change any text, edit `content/case-studies.ts`. To add a case study, add an
object to the `caseStudies` array — the route, the card on the home page and
the sitemap entry all come from it. To give it a diagram, add an entry keyed by
its slug in `Diagrams.tsx`.

The diagrams are plain SVG with no library and no client JavaScript. Boxes size
their own text, so a short box will not push its label outside itself.

---

## Still to do

- [ ] Photo, if you want one — small, in About or the footer
- [ ] CV download link on the site
- [ ] Submit the sitemap in Google Search Console once it is live
- [ ] A mailbox you can send *from*, plus the SPF merge and DMARC
- [ ] A written technical piece (extending BPMN-IO without forking it)
- [ ] Say in the Davilo case study whether that 2025 contract is finished
- [ ] Run Lighthouse and keep it at 100 — you claim Core Web Vitals on your CV
