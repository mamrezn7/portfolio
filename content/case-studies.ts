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
    "Nine years of React and TypeScript on enterprise products in process mining, business process management, digital banking and eLearning, and lately AI features and backend services.",
  /** Under 60 characters, so search results show it whole; carries the brand for "mamrez" searches. */
  title: "Mohammadreza Shirazi (mamrez) — Senior Frontend Engineer",
  description:
    "Mohammadreza Shirazi (mamrez), senior frontend engineer and React developer: nine years of React and TypeScript, now building AI features into enterprise products.",
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
    "Process mining", "Digital banking",
    "Right-to-left interfaces",
  ],
  proof: [
    { value: "9 yrs", label: "React and TypeScript, enterprise products" },
    { value: "4", label: "AI features built for a dashboard builder" },
    { value: "C1 · B2", label: "English and German" },
    { value: "EU", label: "Blue Card eligible, one month’s notice" },
  ],
};

export const aboutNotes = [
  "Remote work with German clients since 2019.",
  "Persian native, English C1, German B2.",
  "Right-to-left layouts and Jalali calendar logic, including the date arithmetic.",
  "Learning C#, .NET and databases, working with an AI coding agent.",
];

export const about = [
  "Most of my nine years have gone into enterprise products where the hard part is what happens to an interface when real data volume arrives: a process-mining platform with large datasets, a business process suite whose workflow editor had to do things its library was never designed for, and a consumer bank whose onboarding flow had to work for six hundred people a day.",
  "In all of them the frontend is the product. There is no fallback interface or power-user CLI, so if a table locks up while it sorts, the feature is broken.",
  "I work in React and TypeScript, long enough to have opinions about state management that I hold loosely. I have worked remotely with German clients since 2019, which has made me better at writing things down.",
  "At Golrang I now build AI features as well as interfaces, in the Farakav dashboard builder. What I care about most in that work is stopping a wrong answer before it reaches the screen. I also use AI tools in my own work, and I review what they produce the way I would review a colleague’s pull request.",
  "That is also where I want to keep growing. Alongside the frontend, I am learning .NET, databases and how to build good AI features, and I am looking for a team where I can do more of both.",
];

/** Roles, newest first, from the resume. */
export const experience = [
  {
    role: "Senior Front-End Engineer",
    org: "Golrang System",
    years: "May 2025 – now",
    note: "Farakav: a process-mining platform, and a rewrite of its dashboard builder with AI features.",
    /** The CV page's detail for this role, from the resume. */
    highlights: [
      "Rewriting the Farakav dashboard builder, working across the front end and the service behind it.",
      "Built its AI features: four assistants that help analysts create and understand dashboards. Their answers are checked before anything reaches the user.",
      "Found the cause of the platform’s slowest workflows and fixed it, taking up to two minutes off them.",
      "Built the platform’s data-management interfaces, which stay responsive over large datasets.",
      "Mentored an intern and worked alongside a mid-level developer through code review and pairing; proposed a refactoring strategy now applied across the platform.",
    ],
  },
  {
    role: "Front-End Engineer",
    org: "Faash",
    years: "May 2024 – May 2025",
    note: "Business process management suite: extensions to its workflow modeller and form builder, an access-control platform.",
    /** The CV page's detail for this role, from the resume. */
    highlights: [
      "Extended an open-source workflow modeller and form builder with custom elements and behaviour, without forking either library.",
      "Added Jalali calendar support across the date logic as well as the display, and right-to-left layout through the process modeller and the form builder.",
      "Gave process designers a way to make form fields react to one another, with no application code shipped for it.",
      "Designed and built an access-control platform: permissions, role and user administration, and audit logging.",
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
      "Built the digital Open Account journey end to end, from identity details to card delivery. It onboards 600+ verified users a day in production.",
      "Kept the journey continuous across the payment step, so people return to where they left off.",
      "Redesigned the sign-in flow and removed duplicate network requests.",
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
    "Senior frontend engineer with nine years building enterprise web applications in React and TypeScript, across process mining, business process management, digital banking and eLearning, and now AI features and backend services. Most of the hard problems came from real data volume and real users: views over large datasets that had to stay responsive, long multi-step flows that had to survive interruptions, and mature libraries I had to extend to fit the product.",
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
    items: ["Language-model APIs", "AI features in products", "AI-assisted development"],
  },
  {
    group: "Backend and data",
    items: ["C#", "ASP.NET Core", "EF Core", "SQL Server", "REST APIs"],
  },
  {
    group: "Diagrams and visualisation",
    items: ["BPMN-IO", "FormJS", "XYFlow"],
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
      "Adding AI features to a dashboard builder, where the product has to catch a wrong answer before anyone sees it.",
    context: "Farakav dashboard builder · Golrang System · 2025 to present",
    metric: { value: "4", label: "AI features built for a dashboard builder" },
    stack: ["React", "TypeScript"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Farakav’s dashboard builder lets analysts build their own reports. I am rewriting it in phases, and the brief also asked for AI: describe what you want, in Persian or English, and get it built.",
          "A language model will happily give a confident answer that is wrong. In a reporting tool that is worse than an error, because people trust the chart that comes out of it.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I started from one rule: the AI suggests and the analyst decides. Nothing it produces takes effect until it has been checked and a person has accepted it. If a suggestion doesn’t hold up, the analyst gets a question instead of a wrong chart.",
          "Four features now follow that rule. They help analysts build dashboards, write calculations and ask questions about what a dashboard shows.",
          "The back end was new to me. I came to it as a TypeScript developer and worked on it with an AI coding agent, reviewing each phase and writing down the reasoning behind each decision.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "An early part of the AI work was built from a summary of the requirements instead of the specification itself, and it had to be redone. I now read the source document before building, however clear the summary sounds.",
        ],
      },
    ],
    result: [
      "AI suggestions are checked before they reach anyone",
      "Four AI features built on the same rule",
      "Analysts can ask in Persian or English",
    ],
    quote:
      "A confident wrong answer is worse than an error, because people trust the chart that comes out of it.",
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
    stack: ["Next.js", "TypeScript"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Opening a bank account online means a long form: identity details, verification, agreements. Each step is a place where people fail, get confused or close the tab, and people who leave and return hours later expect to pick up where they left off.",
          "At Bajet the journey ran from identity details through verification and a fee payment to choosing a card and having it delivered. Payment was the hardest step, because it takes people away from the page they were on.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I built the journey end to end. The longest-running discussion on the team was what should happen when someone came back from paying. We could rebuild the whole journey to fix one step, or make a small change that returned people to where they had left off. We shipped the small change, and it held up in production.",
          "Form validation was the other half. The browser and the server had to agree on what counts as valid, so there was one definition of a valid national ID or phone number.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "I would settle the shape of the flow before writing any of it. Past a certain complexity, patching the gaps costs more than a better structure would have. I needed a clever fix because the architecture had already been chosen.",
        ],
      },
    ],
    result: [
      "600+ verified users onboarded a day in production",
      "People return to the step they left after paying",
    ],
    quote: "I needed a clever fix because the architecture had already been chosen.",
  },
  {
    slug: "bpmn-extensions",
    shape: "bpmn",
    name: "Faash",
    years: "2024–2025",
    title: "Making a workflow library do what it was not built to do",
    blurb:
      "Adding custom elements and behaviour to a mature open-source workflow modeller, without forking it.",
    context: "Enterprise business process management suite · Faash · 2024 to 2025",
    metric: { value: "0", label: "forks of the upstream library" },
    stack: ["React", "TypeScript"],
    sections: [
      {
        heading: "The problem",
        body: [
          "The library is good, with a clear model of a business process, and our customers had processes that did not fit it. We could fork it and maintain the fork forever, work around it and end up with two versions of the same diagram, or extend it the way it was designed to be extended.",
          "Most of the gaps came from where our users are. The product needed Jalali dates in the date logic as well as the interface, and right-to-left layout across the modeller and the form builder. It also needed form fields that react to one another, without a developer shipping code for each form.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I went with the third option. Our custom elements behaved like the built-in ones, so undo, validation and saving all worked on them. A layer drawn over the canvas would have fallen out of sync the first time someone pressed Ctrl+Z.",
          "Process designers could also set up how one form field affects another themselves, with no application code shipped for that form. A process step and its form stayed consistent when either one changed.",
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
      "Custom workflow elements that behave like the built-in ones, including undo and validation",
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
      "Finding out why an analytics platform’s slowest workflows were slow, and taking up to two minutes off them.",
    context: "Farakav, an enterprise process-mining platform · Golrang System · 2025 to present",
    metric: { value: "−2 min", label: "at most, off the slowest workflows" },
    stack: ["React", "TypeScript"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Several workflows on the platform were slow enough that people started them and went to do something else. Nobody reported it any more, because it had always been that way.",
          "Finding the cause needed no special tooling. The browser’s own developer tools pointed straight at it. The useful question was why it was doing so much work.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "Most of that work was for something few people ever needed. I moved it to the moment someone actually asks for it, so everyone else stopped waiting for it.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "I accepted that part of the system as it was for too long. It had been slow since before I joined, everyone had stopped mentioning it, and I treated that as a fact about the system instead of something I could question. Once I looked at what it was doing, the fix was small.",
        ],
      },
    ],
    result: [
      "Up to two minutes removed from the slowest workflows",
      "People no longer wait for work they didn’t ask for",
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
    stack: ["React", "TypeScript"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Davilo began as a self-study site with interactive exercises. I built web and mobile interfaces for it from 2019. In 2025 the client brought me back for a restart: the same material inside a platform with classes, courses, examinations, and separate portals for teachers, students and administrators.",
          "The exercises already worked and carried years of teaching judgement. What needed work was everything around them, and one question nobody could settle: who logs in, and what do they see?",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I kept the existing exercises and built the new platform around them, on the web and in a mobile app. New engineering went where the new requirements were.",
          "The dashboard question was then answered three times. First, one dashboard for teachers and students that changed with the role. Then one login leading to two separate dashboards. Then two logins, each with its own dashboard. Each version meant real rebuilding.",
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
