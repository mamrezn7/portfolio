/**
 * All site content lives here so the copy is editable without touching layout.
 *
 * Anything wrapped in TODO() renders as a visible red block in the browser.
 * That is deliberate: it is a detail only you know, and the site should look
 * broken until you replace it. Search for "TODO(" before you deploy.
 */

export const TODO_PREFIX = "TODO:";
export const TODO = (what: string) => `${TODO_PREFIX} ${what}`;

export type ShapeKind = "card" | "database" | "bpmn" | "cap" | "sparkle";

export const site = {
  url: "https://mamrez.com",
  /** The site's brand, as Google shows it above results: the domain name. */
  brand: "mamrez",
  name: "Mohammadreza Shirazi",
  fullName: "Mohammadreza Haji Amin Shirazi",
  givenName: "Mohammadreza",
  familyName: "Shirazi",
  /**
   * Every form of the name someone might search for. Used in structured
   * data, so a search for any of them can resolve to the same person.
   */
  alternateNames: [
    "Mohammadreza Shirazi",
    "Mohammad Reza Shirazi",
    "Mohammadreza Haji Amin Shirazi",
    "Mohammadreza HA Shirazi",
    "mamrez",
    "محمدرضا شیرازی",
    "محمدرضا حاجی امین شیرازی",
  ],
  /** Shown in About, in Persian script, so the Persian name is on the page too. */
  nameFa: "محمدرضا حاجی امین شیرازی",
  short: "Mohammadreza",
  role: "Senior Frontend Engineer",
  /** The page's real h1: name and role, for search and screen readers. */
  kicker: "Mohammadreza Shirazi, senior frontend engineer: React, TypeScript and AI features",
  /**
   * The display headline. Each fragment is one problem, one of the inflated
   * shapes in the hero, and a link to the case study about it.
   */
  headline: [
    { text: "Lost flows.", slug: "bajet-onboarding", shape: "card" },
    { text: "Overfull screens.", slug: "process-mining-performance", shape: "database", em: true },
    { text: "Stubborn libraries.", slug: "bpmn-extensions", shape: "bpmn" },
    { text: "Shifting rules.", slug: "davilo-lms", shape: "cap", em: true },
    { text: "Confident models.", slug: "farakav-ai-copilot", shape: "sparkle" },
  ] as { text: string; slug: string; shape: ShapeKind; em?: boolean }[],
  sub:
    "Nine years of React and TypeScript on enterprise products in process mining, business process management, digital banking and eLearning, and lately the AI features and .NET services behind them.",
  /** Under 60 characters, so search results show it whole; carries the brand for "mamrez" searches. */
  title: "Mohammadreza Shirazi (mamrez) — Senior Frontend Engineer",
  description:
    "Mohammadreza Shirazi (mamrez), senior frontend engineer and React developer: nine years of React and TypeScript, now building AI features on a .NET platform.",
  location: "Tehran, Iran",
  email: "shirazi@mamrez.com",
  linkedin: "https://www.linkedin.com/in/mohammadreza-ha-shirazi/",
  /** The /cv/ page as a PDF; must match PDF_NAME in scripts/cv-text.mjs. */
  cvPdf: "/Mohammadreza-Shirazi-CV.pdf",
  /** Shown small in About; search engines also use it for the person. */
  portrait: "/portrait.jpg",
  education: "Islamic Azad University, South Tehran Branch",
  phone: "+44 7351 872711",
  phoneHref: "+447351872711",
  timezone: "GMT+3:30",
  availability: "Open to remote roles and to relocation in Europe",
  employer: "Golrang System",
  knowsAbout: [
    "React", "TypeScript", "Next.js", "Frontend architecture", "Web performance",
    "Accessibility", "Large language model integration", "C#", "ASP.NET Core",
    "SQL Server Analysis Services", "DAX", "BPMN-IO", "Process mining", "Digital banking",
    "Right-to-left interfaces",
  ],
  proof: [
    { value: "9 yrs", label: "React and TypeScript, enterprise products" },
    { value: "4", label: "AI features on one model-agnostic gateway" },
    { value: "C1 · B2", label: "English and German" },
    { value: "EU", label: "Blue Card eligible, one month’s notice" },
  ],
};

export const aboutNotes = [
  "Remote work with German clients since 2019.",
  "Persian native, English C1, German B2.",
  "Right-to-left layouts and Jalali calendar logic, including the date arithmetic.",
  "Learning C#, .NET and databases on the current project, working with an AI coding agent.",
];

export const about = [
  "Most of my nine years have gone into enterprise products where the hard part is what happens to an interface when real data volume arrives: a process-mining platform rendering analytical datasets, a business process suite whose workflow editor had to do things its library was never designed for, and a consumer bank whose onboarding flow had to work for six hundred people a day.",
  "In all of them the frontend is the product. There is no fallback interface or power-user CLI, so if a table locks up while it sorts, the feature is broken.",
  "I work in React and TypeScript, long enough to have opinions about state management that I hold loosely. I have worked remotely with German clients since 2019, which has made me better at writing things down.",
  "At Golrang I now build AI features as well as interfaces. In the Farakav dashboard builder, language models propose charts and DAX measures, explain and repair expressions, and answer questions about a dashboard by running real queries. Each feature checks what the model returns against the data model before anything runs. I also use AI tools in my own work, and I review what they produce the way I would review a colleague’s pull request.",
  "That is also where I want to keep growing. Alongside the frontend, I am learning the .NET and database side of the products I work on, and the AI features built on top of them, and I am looking for a team where I can do more of both.",
];

/** Roles, newest first, from the resume. */
export const experience = [
  {
    role: "Senior Front-End Engineer",
    org: "Golrang System",
    years: "May 2025 – now",
    note: "Farakav: the process-mining platform, and a rewrite of its dashboard builder with AI features and a .NET back end.",
    /** The CV page's detail for this role, from the resume. */
    highlights: [
      "Rewriting the Farakav dashboard builder: a React and TypeScript front end with sixteen visual types on a drag-and-drop canvas, and an ASP.NET Core service over SSAS that generates DAX and runs the queries.",
      "Built its AI features on one model-agnostic gateway (Claude, OpenAI and an internal model, with fallback and usage tracking): a dashboard copilot, an analyst, a DAX copilot and a natural-language measure builder. Each checks what the model returns against the data model before anything runs.",
      "Found the endpoint behind the platform’s slowest workflows: it ran a separate query for every field it returned. Deferring those queries until the click took up to two minutes off those workflows.",
      "Built the platform’s data-management interfaces (metadata, data sources, complex CRUD workflows) over large analytical datasets without the UI locking up.",
      "Mentored an intern and worked alongside a mid-level developer through code review and pairing; proposed a modular refactoring strategy now applied across core services.",
    ],
  },
  {
    role: "Front-End Engineer",
    org: "Faash",
    years: "May 2024 – May 2025",
    note: "Business process management suite: BPMN-IO and FormJS extensions, an access-control platform.",
    /** The CV page's detail for this role, from the resume. */
    highlights: [
      "Extended BPMN-IO and FormJS through their module system and command stack: custom element types, rendering and behaviours that stay in sync through undo, validation and serialisation, without forking upstream.",
      "Added Jalali calendar support across the date logic as well as the display, and right-to-left layout through the process modeller and the form builder.",
      "Exposed validation and input events to process designers, so a form field can set, clear or re-validate another field with no application code shipped for it.",
      "Designed and built an access-control platform: granular permissions, role and user administration, system configuration and audit logging.",
      "Built shared components adopted across several internal dashboards; feature work ran about 25% faster afterwards.",
    ],
  },
  {
    role: "Front-End Engineer",
    org: "Simorq Tejarat",
    years: "Nov 2021 – May 2024",
    note: "Bajet, a consumer banking PWA: the Open Account journey, onboarding 600+ verified users a day.",
    /** The CV page's detail for this role, from the resume. */
    highlights: [
      "Built the digital Open Account journey end to end: identity capture, bank and credit checks, fee payment, card selection and delivery. It onboards 600+ verified users a day in production.",
      "Kept the journey resumable across the payment step, which returned in a separate browser tab, by handing the result back to the original tab over a BroadcastChannel.",
      "Redesigned authentication and state-management flows, cutting duplicate network requests through better use of the Context API and client caching.",
      "Developed customer-facing banking features within the security and compliance constraints of regulated software.",
    ],
  },
  {
    role: "Front-End Engineer, contract",
    org: "Davilo (Germany, remote)",
    years: "Jul 2019 – Sep 2021, and 2025",
    note: "A language-learning platform, rebuilt in 2025 as a learning management system.",
    /** The CV page's detail for this role, from the resume. */
    highlights: [
      "Built responsive web and mobile interfaces for a German language-learning platform, working asynchronously with designers and stakeholders across time zones.",
      "Brought back in 2025 for a full product restart: a learning management system with online classes, course management, examinations, and teacher, student and administrator portals.",
    ],
  },
  {
    role: "Front-End Developer, freelance",
    org: "Various clients",
    years: "2018 – 2020",
    note: "React and WordPress builds; performance, SEO and accessibility work.",
    /** The CV page's detail for this role, from the resume. */
    highlights: [
      "Built web applications and business sites in React, JavaScript and WordPress for clients across several industries.",
      "Improved performance, SEO, accessibility and PageSpeed scores through frontend optimisation.",
    ],
  },
  {
    role: "Junior Front-End Developer",
    org: "Viratech Sharif",
    years: "Jun 2017 – Oct 2018",
    note: "Startup products in AngularJS, in a cross-functional Agile team.",
    /** The CV page's detail for this role, from the resume. */
    highlights: [
      "Built responsive web applications for early-stage startup products in AngularJS, in a cross-functional Agile team.",
      "My main team was Justro, where I developed and launched three startup projects (Justro, Daal and Minit) and grew Daal’s organic traffic by 30% in six months.",
    ],
  },
];

export const education = "B.Sc. Information Technology, Islamic Azad University, South Tehran Branch, 2013 – 2019";

/** The CV page's own sections, from the resume. */
export const cv = {
  summary:
    "Senior frontend engineer with nine years building enterprise web applications in React and TypeScript, across process mining, business process management, digital banking and eLearning, and now the AI features and .NET services behind them. Most of the hard problems came from real data volume and real users: views over large datasets that had to stay responsive, long multi-step flows that had to survive interruptions, and mature libraries I had to extend to fit the product.",
  education: [
    "B.Sc. Information Technology, Islamic Azad University, South Tehran Branch, 2013 – 2019.",
    "M.Sc. Information Technology (E-commerce), same university, 2019 – 2022: around 90% complete, discontinued for work, degree not awarded.",
  ],
  languages: ["Persian: native", "English: C1, professional working proficiency", "German: B2, upper intermediate"],
  authorisation:
    "Iranian national based in Tehran. Requires employer sponsorship to relocate, and meets the experience and salary criteria for the EU Blue Card under the IT shortage-occupation threshold and for the Dutch Highly Skilled Migrant scheme. Open to relocation in Europe and to fully remote roles. One month’s notice.",
};

/** Grouped for scanning; every item is on the resume or in a case study. */
export const skills = [
  {
    group: "Frontend",
    items: ["React", "TypeScript", "Next.js", "Vite", "Redux Toolkit", "TanStack Query", "React Hook Form", "Zod", "Ant Design", "Material UI", "Tailwind CSS"],
  },
  {
    group: "AI",
    items: ["Claude and OpenAI APIs", "Tool calling", "Grounding in metadata", "Model gateway with routing and fallback"],
  },
  {
    group: "Backend and data",
    items: ["C#", "ASP.NET Core", "EF Core", "SQL Server", "SSAS", "DAX", "REST APIs"],
  },
  {
    group: "Diagrams and visualisation",
    items: ["BPMN-IO", "FormJS", "XYFlow", "Recharts", "GridStack"],
  },
  {
    group: "Quality",
    items: ["Accessibility (WCAG)", "Core Web Vitals", "SSR and SSG", "i18n and right-to-left", "Code review"],
  },
  {
    group: "Tooling",
    items: ["Git", "Docker", "Azure DevOps", "CI/CD"],
  },
];

export type CaseStudy = {
  slug: string;
  /** The inflated shape that stands for this problem in the hero. */
  shape: ShapeKind;
  /** Short name for navigation and cards. */
  name: string;
  years: string;
  title: string;
  /** A shorter title for search results, when the real one would push the name past 60 characters. */
  seoTitle?: string;
  blurb: string;
  context: string;
  /** The one number shown large on the home-page card. */
  metric: { value: string; label: string };
  stack: string[];
  sections: { heading: string; body: string[] }[];
  result: string[];
  /** One line from the case study, set as a pull quote. */
  quote: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "farakav-ai-copilot",
    shape: "sparkle",
    name: "Farakav · Golrang System",
    years: "2025–now",
    title: "An AI copilot that is not allowed to guess",
    blurb:
      "Adding language-model features to a Power BI-style dashboard builder, where every column the model names is checked against the data model before anything runs.",
    context: "Farakav dashboard builder, analytics on SSAS · Golrang System · 2025 to present",
    metric: { value: "4", label: "AI features on one model-agnostic gateway" },
    stack: ["React", "TypeScript", "C# / ASP.NET Core", "EF Core", "SSAS / DAX", "Claude and OpenAI APIs"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Farakav’s dashboard builder lets analysts build Power BI-style reports on SSAS models. I am rewriting it in phases: a React and TypeScript front end with sixteen visual types on a drag-and-drop canvas, and an ASP.NET Core service that reads the model’s metadata, generates DAX and runs the queries.",
          "The brief also asked for AI: describe a chart or a measure, in Persian or English, and get it built. A language model will happily produce a plausible column name that does not exist. In a reporting tool that is worse than an error, because people trust the chart that comes out of it.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "The model never writes a query and never reaches SSAS. In the dashboard copilot it can do three things: propose a query definition, propose a DAX measure, or ask a clarifying question. Its prompt carries the model’s real metadata, with hidden fields left out.",
          "Every column and measure id it proposes is checked against that metadata before the proposal reaches the screen. If one does not exist, the proposal becomes a clarifying question. An accepted proposal runs through the same query engine and measure validation as a hand-built visual, so the AI adds no second path to the data.",
          "Later features follow the same rule: a natural-language measure builder, a DAX copilot that explains, repairs and generates expressions, and an analyst that answers questions about a dashboard by running validated queries. All of them call one AI gateway that routes by task and data-sensitivity policy, falls back to a second provider when the first fails, and logs usage and cost. Moving between Claude, OpenAI and the company’s internal model is a configuration change.",
          "The back end was new to me. I came to it as a TypeScript developer and wrote the C# with an AI coding agent, reviewing each phase, checking it against a real SSAS model, and keeping the reasoning behind each design decision in the repository’s docs.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "The first version of the AI gateway was built from a summary of the requirements instead of the specification itself, and it came out as a third hard-coded provider. The real spec asked for a model-agnostic gateway, so that work was redone. I now read the source document before building, however clear the summary sounds.",
        ],
      },
    ],
    result: [
      "Every column or measure a model proposes is checked against the real data model before anything runs",
      "Claude, OpenAI and an internal model behind one gateway, with fallback and usage tracking",
      "Sixteen visual types on one shared query engine, covered by 571 backend tests",
    ],
    quote:
      "A plausible column name that does not exist is worse than an error, because people trust the chart that comes out of it.",
  },
  {
    slug: "bajet-onboarding",
    shape: "card",
    name: "Bajet · Simorq Tejarat",
    years: "2021–2024",
    title: "An account-opening flow that onboards 600 people a day",
    seoTitle: "A bank onboarding flow for 600 people a day",
    blurb:
      "The digital Open Account journey for a consumer bank, where every extra step loses a share of the people who started.",
    context: "Bajet, a consumer digital banking PWA · Simorq Tejarat · 2021 to 2024",
    metric: { value: "600+", label: "verified users onboarded a day" },
    stack: ["Next.js", "TypeScript", "Redux Toolkit", "Material UI"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Opening a bank account online means a long form: identity details, verification, agreements. Each step is a place where people fail, get confused or close the tab. Steps can also fail asynchronously and come back later, some can be retried and some cannot, and people leave and return hours later expecting to pick up where they left off.",
          "A wizard with a step counter in component state breaks the first time someone refreshes the page.",
          "At Bajet the journey was a tree: personal and identity data, bank-side checks, a credit check, a payment step for the account-opening fee, then card selection and delivery details. The checks returned on their own schedule. Payment was the step that broke the model. The gateway opened in a new tab, and its callback returned to the flow’s base URL instead of the step that had started it. Step state lived in the client, so the returning tab knew nothing: the user paid and landed back at the beginning.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "The flow ran on client state, each step handing off to the next. That works until a step leaves the page, and payment did. What to do about it was the longest-running argument on the team.",
          "I argued for a BroadcastChannel between the two tabs, and that is what we shipped. The callback tab only announced the payment result; the original tab listened, advanced its own state and closed the other tab. The alternative was to rebuild the flow so a returning tab could reconstruct its position from the server. That was the more correct answer, and it meant rewriting the whole journey to fix one step. The BroadcastChannel change was small, and it held up in production.",
          "Form validation was the other half. The same rules had to run in the browser and in the API, so there was one schema, and one definition of a valid national ID or phone number.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "I would settle the shape of the flow before writing any of it. Past a certain complexity, keeping step state in the client and patching the gaps costs more than routed steps would have. With routing, the payment callback would have been an ordinary page load. I needed a clever fix because the architecture had already been chosen.",
        ],
      },
    ],
    result: [
      "600+ verified users onboarded a day in production",
      "The journey continues in the original tab after payment returns in a separate one",
    ],
    quote: "I needed a clever fix because the architecture had already been chosen.",
  },
  {
    slug: "bpmn-extensions",
    shape: "bpmn",
    name: "Faash",
    years: "2024–2025",
    title: "Making BPMN-IO do what it was not built to do",
    blurb:
      "Adding custom elements and behaviour to a mature open-source workflow modeller through its own extension points, without forking it.",
    context: "Enterprise business process management suite · Faash · 2024 to 2025",
    metric: { value: "0", label: "forks of the upstream library" },
    stack: ["React", "TypeScript", "BPMN-IO", "FormJS", "XYFlow"],
    sections: [
      {
        heading: "The problem",
        body: [
          "BPMN-IO is a good library with a clear model of a business process, and our customers had processes that did not fit it. We could fork it and maintain the fork forever, work around it in application code and end up with two models of the same diagram, or learn its extension points and use them.",
          "Most of the gaps came from where our users are. The product needed Jalali dates in the date logic as well as the interface, and right-to-left layout across the modeller and the form builder. It also needed form fields that react to one another, which meant exposing validation, onChange and the other input events to process designers instead of keeping them inside application code.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I went with the third option. BPMN-IO has a module system and a command stack, and through them you can add element types, override rendering and hook into behaviour without touching the library’s source. Our custom nodes took part in undo and redo, validation and serialisation. A layer drawn over the canvas would have fallen out of sync the first time someone pressed Ctrl+Z.",
          "The clearest example is a form-builder field whose value is a JavaScript function. A process designer writes a handler into the form definition and it runs as a real event handler on the rendered form, so changing field X can set, clear or re-validate field Y with no application code shipped for that form.",
          "I did the same with FormJS on the form side, so a process step and its form stayed consistent when either one changed.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "I would question building on that library at all. It was much larger than our requirements, and every feature we added had to fit someone else’s architecture. Starting from scratch would have cost more in the first month and less in every month after.",
        ],
      },
    ],
    result: [
      "Custom workflow elements that take part correctly in undo, validation and serialisation",
      "No fork of the upstream library, so version upgrades stayed routine",
    ],
    quote: "Every feature we added had to fit someone else’s architecture.",
  },
  {
    slug: "process-mining-performance",
    shape: "database",
    name: "Farakav · Golrang System",
    years: "2025–now",
    title: "Two minutes off the slowest workflow",
    blurb:
      "Finding the endpoint behind an analytics platform’s slowest workflows, and moving hundreds of per-field queries to the moment someone opens an item.",
    context: "Farakav, an enterprise process-mining platform · Golrang System · 2025 to present",
    metric: { value: "−2 min", label: "at most, off the slowest workflows" },
    stack: ["React", "TypeScript", "Vite", "Ant Design", "TanStack Query"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Several workflows on the platform were slow enough that people started them and went to do something else. Nobody reported it any more, because it had always been that way.",
          "Finding the cause needed no special tooling. One endpoint was clearly slower than everything around it, and the browser’s network panel showed it. The useful question was what that request was doing.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "It ran a separate query for every field it returned, and a response could carry hundreds of fields. That data only appeared after a user clicked an individual item, and for most items nobody did. I moved the work to the click. The list request now returns only the list, and the detail query runs once, for the item someone opens.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "I accepted that endpoint as it was for too long. It had been slow since before I joined, everyone had stopped mentioning it, and I treated that as a fact about the system instead of something I could question. Once I looked at what it was doing, the fix was small.",
        ],
      },
    ],
    result: [
      "Up to two minutes removed from the slowest workflows",
      "Hundreds of per-field queries removed from the list request",
    ],
    quote: "Once I looked at what it was doing, the fix was small.",
  },
  {
    slug: "davilo-lms",
    shape: "cap",
    name: "Davilo",
    years: "2019–21, 2025",
    title: "The same dashboard, rebuilt three times",
    blurb:
      "Turning a German self-study language platform into a learning management system, and answering one question three times: who logs in, and what do they see?",
    context:
      "Davilo, a German language-learning platform · contract, remote · 2019 to 2021, and again in 2025",
    metric: { value: "3", label: "access models shipped for one product" },
    stack: ["React", "TypeScript", "Material UI", "Bootstrap", "REST APIs"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Davilo began as a self-study site with browser exercises written in JavaScript: matching pairs of cards, filling in blanks, connecting recorded audio to the right word. I built web and mobile interfaces for it from 2019. In 2025 the client brought me back for a restart: the same material inside a platform with classes, courses, examinations, and separate portals for teachers, students and administrators.",
          "The exercises already worked and carried years of teaching judgement. What needed work was everything around them, and one question nobody could settle: who logs in, and what do they see?",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I wrapped the existing exercises instead of rebuilding them. They stayed as they were, and the new application took over accounts, authentication and how an exercise is presented, on the web and in a mobile app. New engineering went where the new requirements were.",
          "The dashboard question was then answered three times. First, one dashboard for teachers and students that changed with the role. Then one login routing to two separate dashboards. Then two logins, each with its own dashboard. Each version needed different routing, session handling and component boundaries.",
          "The engagement was a contract alongside other work, in a different time zone, so I had to be deliberate about availability: reachable when something broke, and never the reason someone else was blocked.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "I would push harder on things I was sure about. More than once I could see that a direction would have to be undone, said so once, and let it go. At least one of the three rebuilds was avoidable. Nobody was careless; the person who could see the cost most clearly stopped arguing for it.",
        ],
      },
    ],
    result: [
      "The same German client across two engagements: 2019 to 2021, and 2025",
      "Existing exercises reused in a new web and mobile product",
      "Teacher, student and administrator flows delivered through three successive access models",
    ],
    quote: "At least one of the three rebuilds was avoidable.",
  },
];
