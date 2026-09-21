# mamrez.com

Static Next.js site, exported to plain HTML and served by Cloudflare Pages.

No Tailwind, no component library. The styling is one CSS file using custom
properties, which means nothing to configure, no build-tool surprises, and a
reviewer can see you write CSS rather than only compose utility classes. If you
would rather use Tailwind, swapping it in is mechanical — the class names in
`app/globals.css` map almost one to one.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # writes ./out
```

If `npm install` complains about versions, the fastest fix is to scaffold fresh
and copy the source in:

```bash
npx create-next-app@latest mamrez --typescript --app --no-tailwind --no-src-dir
# then copy app/, components/, content/ and next.config.mjs over the new project
```

That way you get whatever Next and React are current rather than the ranges
pinned in `package.json`.

---

## Before you deploy: the red blocks

`content/case-studies.ts` is the only file with copy in it. Everything wrapped
in `TODO(...)` renders as a red dashed box on the page, on purpose, so the site
looks obviously unfinished until you fill them in.

```bash
grep -rn "TODO(" content/
```

There are nine of them. They are all places where the answer is a technical
detail only you have. The site is not ready to show anyone while any of them
are still there — a case study that describes a problem and then goes vague
about the solution reads worse than no case study.

Three of them are "What I would do differently". Do not skip those and do not
turn them into humblebrags. A real, small, specific regret is the single
strongest credibility signal on the whole site, and interviewers notice both when it
is missing and when it is fake.

---

## Deploy to Cloudflare Pages

1. Push the repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**, and pick the repo.
3. Build settings:
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
4. Deploy. You get a `*.pages.dev` URL immediately.

### Point mamrez.com at it

If the domain is not on Cloudflare yet, add it first (**Add a site**, free
plan), then change the nameservers at your registrar to the two Cloudflare
gives you. Propagation is usually under an hour.

Then in the Pages project → **Custom domains** → add `mamrez.com` and
`www.mamrez.com`. Cloudflare creates the DNS records and the certificate.

---

## Email on the domain

Two halves, and they are genuinely separate problems.

**Receiving** is free and takes five minutes. Cloudflare dashboard → **Email**
→ **Email Routing** → enable. Add `shirazi@mamrez.com` as a custom address
forwarding to whatever inbox you already read. Cloudflare adds the MX and SPF
records itself. Verify the destination address and it works straight away.

**Sending as `shirazi@mamrez.com`** is the part Cloudflare does not do. It
routes mail in, never out. So after enabling forwarding you can receive replies
but you would still be sending from your old address, which defeats the point.
For that you need an actual mailbox — see the notes I sent separately on which
providers to try.

Whichever you use, make sure SPF, DKIM and DMARC are all set before you send
anything to a recruiter. A brand new domain with no authentication records goes
to spam, and you will never find out that it did.

### Test before you rely on it

```
Send from another account to shirazi@mamrez.com, confirm it arrives.
Reply from shirazi@mamrez.com to a Gmail address, confirm it lands in the inbox
and not in spam, and check the message header says DKIM pass and SPF pass.
```

Do not put the address on the CV until both directions work.

---

## Structure

```
app/
  layout.tsx           shell, fonts, metadata, header, footer
  page.tsx             home: hero, work list, about
  work/[slug]/page.tsx case study template
  globals.css          all styling
components/
  Prose.tsx            paragraph renderer, turns TODO markers into red blocks
content/
  case-studies.ts      every word on the site
```

Adding a case study means adding one object to the `caseStudies` array. The
route and the card on the home page both come from it.

---

## Things worth doing once it is live

- Swap `Instrument Serif` for something else if you want the site to feel less
  like mine and more like yours. The font is set in one place, `app/layout.tsx`.
- Add an OG image so links to the site look right when someone shares them.
- Run Lighthouse and keep it at 100 across the board. You list Core Web Vitals
  on your CV; the first thing a curious reviewer does is check whether your own
  site backs that up.
- Once the testing work is done, add a fourth case study about it. That turns a
  gap in your CV into a page that demonstrates the opposite.
