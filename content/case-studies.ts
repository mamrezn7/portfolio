/**
 * All site content lives here so the copy is editable without touching layout.
 *
 * Anything wrapped in TODO() renders as a visible red block in the browser.
 * That is deliberate: it is a detail only you know, and the site should look
 * broken until you replace it. Search for "TODO(" before you deploy.
 */

export const TODO_PREFIX = "TODO:";
export const TODO = (what: string) => `${TODO_PREFIX} ${what}`;

export const site = {
  name: "Mohammadreza Shirazi",
  short: "Mohammadreza",
  role: "Frontend Engineer",
  kicker: "Frontend engineer · React and TypeScript · Enterprise web applications",
  headline:
    "The flow that loses people. The screen with more data than it can hold. The library that will not bend. The rules that keep changing.",
  sub:
    "These are the problems I have spent nine years on. Process mining, business process management, digital banking, language learning.",
  description:
    "Frontend engineer, React and TypeScript. Nine years on enterprise web applications: process mining, business process management, digital banking.",
  email: "shirazi@mamrez.com",
  linkedin: "https://linkedin.com/in/mohammadreza-ha-shirazi",
  timezone: "GMT+3:30",
  availability: "Open to remote roles and to relocation in Europe",
};

export const about = [
  "I have spent most of the last nine years on enterprise products where the interesting problem is not the interface itself but what happens when real data volume hits it. A process-mining platform rendering analytical datasets. A business process suite whose workflow editor had to do things its underlying library was never designed for. A consumer bank where the onboarding flow either worked at six hundred people a day or it did not work at all.",
  "The common thread is that these are all products where the frontend is the product. There is no fallback interface, no power-user CLI. If the table locks up while it sorts, the feature is broken.",
  "I work in React and TypeScript, and I have been doing it long enough to have opinions about state management that I hold loosely. I have worked remotely with a German team since 2019, across three separate contracts, which has made me better at writing things down than I would otherwise be.",
];

export type CaseStudy = {
  slug: string;
  title: string;
  blurb: string;
  context: string;
  stack: string[];
  sections: { heading: string; body: string[] }[];
  result: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "bajet-onboarding",
    title: "An account-opening flow that onboards 600 people a day",
    blurb:
      "Building the digital Open Account journey for a consumer bank, where every additional step costs you a measurable percentage of the people who started.",
    context: "Bajet, a consumer digital banking PWA · Simorq Tejarat · 2021 to 2024",
    stack: ["Next.js", "TypeScript", "Redux Toolkit", "Material UI"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Opening a bank account digitally is a long form wearing a costume. The user has to supply identity information, pass verification, and agree to things, and every one of those steps is a place where they can fail, get confused, or simply close the tab. The flow is also not really a flow: steps can fail asynchronously and come back later, some can be retried and some cannot, and the user can leave and return hours afterwards expecting to be where they left off.",
          "The naive version of this is a wizard with a step counter in component state. That version breaks the first time someone refreshes the page.",
          "At Bajet the journey was a tree rather than a line: personal and identity data, bank-side checks, a credit check, a payment step for the account-opening fee, then card selection and delivery details. The checks returned on their own schedule. The step that broke the model was payment. The gateway had to open in a new tab, and its callback came back to the base URL of the flow rather than to the step that had started it. Because step state lived in the client, the returning tab knew nothing: the user paid successfully and landed back at the beginning.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "The flow was driven from client state, one step handing off to the next, which works until a step leaves the page entirely. Payment did exactly that, and what to do after it came back was the longest-running argument on the team.",
          "What I argued for, and what we shipped, was a BroadcastChannel between the two tabs. The callback tab\u2019s only job became announcing the payment result; the original tab listened, advanced its own state, and closed the other one. The alternative on the table was rebuilding the flow so the returning tab could reconstruct its position from the server \u2014 the more correct answer, and a rewrite of the whole journey rather than a change to one step. The BroadcastChannel version was small, it shipped, and it held.",
          "Form handling was the other half. Validation had to run identically on the client and against the API's own rules, which meant one schema and no second source of truth about what a valid national ID or phone number looked like.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "I would spend real time on the shape of the flow before writing any of it. Past a certain complexity, holding step state in the client and stitching over the gaps costs more than routing would have. Routed steps would have made the payment callback a non-problem instead of something I had to be clever about, and I was clever about it because the architecture had already been chosen.",
        ],
      },
    ],
    result: [
      "600+ verified users onboarded per day in production",
      "Flow survives refresh, session expiry, and asynchronous verification coming back late",
    ],
  },
  {
    slug: "bpmn-extensions",
    title: "Making BPMN-IO do what it was not built to do",
    blurb:
      "Extending a mature open-source workflow modeller with custom components and behaviours, without forking it and without fighting it.",
    context: "Enterprise business process management suite · Faash · 2024 to 2025",
    stack: ["React", "TypeScript", "BPMN-IO", "FormJS", "XYFlow"],
    sections: [
      {
        heading: "The problem",
        body: [
          "BPMN-IO is a good library with a clear idea of what a business process looks like. Our customers had processes that did not fit that idea. The options were to fork the library and inherit its maintenance forever, to work around it in application code and end up with two competing models of the same diagram, or to learn its extension points properly and use them.",
          "Most of the gaps were about where our users are. The product needed Jalali dates \u2014 not only a Persian calendar in the interface but the date logic behind it \u2014 and right-to-left layout throughout the modeller and the form builder. It also needed form fields that could react to one another, which meant exposing validation, onChange and the other input events as things a process designer could attach behaviour to rather than internals only the application code could reach.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I went with the third option. BPMN-IO exposes a module system and a command stack, and once you stop treating it as a black box you can add element types, override rendering, and hook into its behaviours without ever touching its source. That meant our custom nodes participated properly in undo and redo, in validation, and in serialisation, instead of being a layer painted on top that desynchronised the moment someone pressed Ctrl+Z.",
          "The clearest example is a form-builder field whose value is a JavaScript function. A process designer writes a handler into the form definition and it is wired up as a real event handler on the rendered form, so changing field X can set, clear or re-validate field Y without anyone shipping application code for that particular form.",
          "The same approach applied to FormJS for the form-building side, so that a process step and the form attached to it stayed consistent as either one changed.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "Building on that open-source project at all. It was considerably larger than our requirements needed, and every feature we added was a negotiation with someone else\u2019s architecture. Starting from scratch would have been more work in the first month and less work in every month after it.",
        ],
      },
    ],
    result: [
      "Custom workflow elements that participate correctly in undo, validation, and serialisation",
      "No fork of the upstream library, so version upgrades stayed routine",
    ],
  },
  {
    slug: "process-mining-performance",
    title: "Two minutes off the slowest workflow",
    blurb:
      "Finding and fixing a data-transport bottleneck on an enterprise analytics platform, and the unglamorous work of proving where the time actually went.",
    context: "Farakav, an enterprise process-mining platform · Golrang System · 2025 to present",
    stack: ["React", "TypeScript", "Vite", "Ant Design", "TanStack Query"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Several workflows on the platform were slow enough that people had learned to start them and go and do something else. Slow in a way that everyone had stopped reporting, because it had always been like that.",
          "Finding it needed no instrumentation and no tooling. One endpoint was visibly slower than everything around it, and the network panel was enough to say so with confidence. The question worth asking was not which request was slow. It was what that request was doing.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "It was running a query for every field it returned, and a response could carry hundreds of fields. All of that work produced data that was only ever displayed once a user clicked an individual item \u2014 which, for most items, nobody did. So I moved it to the click. The list request returns the list; the detail query runs once, for the one item someone actually opened. Hundreds of queries per request became none.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "I accepted the shape of that endpoint for far longer than I should have. It had been slow since before I arrived, everyone had stopped mentioning it, and I treated that as a fact about the system rather than a question I was allowed to ask. Once I asked it, the fix was small. What it cost was all the time nobody spent asking.",
        ],
      },
    ],
    result: [
      "Up to two minutes removed from the slowest critical workflows",
      "Hundreds of per-field queries removed from a single request path",
    ],
  },
  {
    slug: "davilo-lms",
    title: "The same dashboard, rebuilt three times",
    blurb:
      "Turning a German self-study language platform into a learning management system, where the hard part was never the exercises \u2014 it was deciding who is looking at the screen.",
    context:
      "Davilo, a German language-learning platform \u00b7 contract, remote \u00b7 2019 to 2021, and again in 2025",
    stack: ["React", "TypeScript", "Material UI", "Bootstrap", "REST APIs"],
    sections: [
      {
        heading: "The problem",
        body: [
          "Davilo began as a self-study site: browser-based exercises written in JavaScript \u2014 matching pairs of cards, filling in blanks, connecting recorded audio to the right word. I built web and mobile interfaces for it from 2019, and in 2025 the client came back for a restart: the same learning material, now inside a platform with classes, courses, examinations, and separate portals for teachers, students and administrators.",
          "The exercises were not the problem. They existed, they worked, and years of teaching judgement were sitting in them. The problem was everything wrapped around them, and one question in particular that nobody could settle: who logs in, and what do they see when they do.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I wrapped the existing material rather than rebuilding it. The original JavaScript exercises stayed as they were, and the new application took ownership of accounts, authentication, and how an exercise is presented \u2014 on the web and inside a mobile app. The part of the product with real pedagogical work behind it was left alone, and the new engineering went where the new requirements actually were.",
          "Then the dashboard question was answered three times. First, one dashboard serving teachers and students alike, changing what it showed according to the role. Then a single login routing to two entirely separate dashboards. Then two separate logins, each leading to its own. Those are three different shapes for routing, session handling and component boundaries \u2014 not three stylesheets.",
          "Working with the client meant not sharing their hours. The engagement was a contract alongside other work, so the thing I had to be deliberate about was availability: reachable when something broke, and never the reason someone else was blocked.",
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "Press harder on the things I was sure about. There were moments in that project where I could see a direction would have to be undone later, and I said so once and then let it go. The dashboard was rebuilt three times, and at least one of those rebuilds was avoidable \u2014 not because anyone was careless, but because the person with the clearest view of what the change would cost stopped arguing for it.",
        ],
      },
    ],
    result: [
      "Six years with the same German client, across two engagements four years apart",
      "Existing exercises reused inside a new web and mobile product rather than rebuilt",
      "Teacher, student and administrator flows delivered through three successive access models",
    ],
  },
];
