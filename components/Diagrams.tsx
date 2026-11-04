/**
 * One diagram per case study, at the level a user would see: what happens
 * for the person, never how the product does it.
 *
 * Plain inline SVG: no library, no client JavaScript, a couple of KB each.
 * All colour comes from the CSS custom properties in globals.css, so the
 * diagrams follow light and dark mode without a second copy.
 */

import type { ReactElement, ReactNode } from "react";

type BoxProps = {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: string;
  tone?: "plain" | "bad" | "good";
};

function Box({ x, y, w = 170, h = 58, title, sub, tone = "plain" }: BoxProps) {
  const cls =
    tone === "bad" ? "dBox dBoxBad" : tone === "good" ? "dBox dBoxGood" : "dBox";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} className={cls} />
      <text x={x + 14} y={y + (sub ? h / 2 - 3 : h / 2 + 4.5)} className="dLabel">
        {title}
      </text>
      {sub ? (
        <text x={x + 14} y={y + h / 2 + 13} className="dMuted">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Arrow({
  x1,
  x2,
  y,
  label,
  tone = "plain",
}: {
  x1: number;
  x2: number;
  y: number;
  label?: string;
  tone?: "plain" | "accent";
}) {
  const line = tone === "accent" ? "dStroke dStrokeAccent dDashed" : "dStroke";
  const head = tone === "accent" ? "dHead dHeadAccent" : "dHead";
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - 7} y2={y} className={line} />
      <polygon points={`${x2},${y} ${x2 - 8},${y - 4.5} ${x2 - 8},${y + 4.5}`} className={head} />
      {label ? (
        <text x={(x1 + x2) / 2} y={y - 9} className="dMuted dMid">
          {label}
        </text>
      ) : null}
    </g>
  );
}

function RowLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} className="dRowLabel">
      {text}
    </text>
  );
}

/** A home-page thumbnail passes a cropped viewBox and hides itself from
    screen readers: the card's own text already says what the diagram shows. */
type DiagramProps = { viewBox?: string; decorative?: boolean };

function Frame({
  children,
  height,
  title,
  viewBox,
  decorative,
}: DiagramProps & {
  children: ReactNode;
  height: number;
  title: string;
}) {
  return (
    <svg
      viewBox={viewBox ?? `0 0 640 ${height}`}
      {...(decorative
        ? { "aria-hidden": true, focusable: false }
        : { role: "img", "aria-label": title })}
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

function BajetDiagram(props: DiagramProps) {
  return (
    <Frame {...props} height={236} title="The account-opening journey, from identity details to a delivered card">
      <RowLabel x={4} y={20} text="The journey" />
      <Box x={4} y={32} title="Your details" sub="identity and contact" />
      <Box x={235} y={32} title="Verification" sub="the bank checks them" />
      <Box x={466} y={32} title="Fee payment" sub="leaves the page" />
      <Arrow x1={174} x2={235} y={61} />
      <Arrow x1={405} x2={466} y={61} />

      <RowLabel x={4} y={150} text="And on" />
      <Box x={4} y={162} title="Back in place" sub="where you left off" tone="good" />
      <Box x={235} y={162} title="Choose a card" sub="and where it goes" />
      <Box x={466} y={162} title="Account open" sub="card on its way" tone="good" />
      <Arrow x1={174} x2={235} y={191} />
      <Arrow x1={405} x2={466} y={191} />
    </Frame>
  );
}

function BpmnDiagram(props: DiagramProps) {
  return (
    <Frame {...props} height={236} title="An extended workflow element behaves like a built-in one">
      <RowLabel x={4} y={20} text="Standard library" />
      <Box x={4} y={32} title="A customer process" sub="with its own needs" />
      <Box x={235} y={32} title="The modeller" sub="has no such element" />
      <Box x={466} y={32} title="It doesn&apos;t fit" sub="process left out" tone="bad" />
      <Arrow x1={174} x2={235} y={61} />
      <Arrow x1={405} x2={466} y={61} />

      <RowLabel x={4} y={150} text="Extended, no fork" />
      <Box x={4} y={162} title="A customer process" sub="with its own needs" />
      <Box x={235} y={162} title="The modeller" sub="with a custom element" />
      <Box x={466} y={162} title="It fits" sub="undo and validation work" tone="good" />
      <Arrow x1={174} x2={235} y={191} />
      <Arrow x1={405} x2={466} y={191} />
    </Frame>
  );
}

function FarakavDiagram(props: DiagramProps) {
  return (
    <Frame {...props} height={236} title="The slowest workflows, before and after">
      <RowLabel x={4} y={20} text="Before" />
      <Box x={4} y={32} title="Open a workflow" sub="start the task" />
      <Box x={235} y={32} title="Everything prepared" sub="needed or not" />
      <Box x={466} y={32} title="A long wait" sub="up to two minutes more" tone="bad" />
      <Arrow x1={174} x2={235} y={61} />
      <Arrow x1={405} x2={466} y={61} />

      <RowLabel x={4} y={150} text="After" />
      <Box x={4} y={162} title="Open a workflow" sub="start the task" />
      <Box x={235} y={162} title="What you need now" sub="and nothing else" />
      <Box x={466} y={162} title="No extra wait" sub="the rest on request" tone="good" />
      <Arrow x1={174} x2={235} y={191} />
      <Arrow x1={405} x2={466} y={191} />
    </Frame>
  );
}

function DaviloPanel({
  x,
  label,
  shape,
}: {
  x: number;
  label: string;
  shape: "one" | "split" | "two";
}) {
  return (
    <g>
      <RowLabel x={x} y={20} text={label} />
      {shape === "one" ? (
        <>
          <Box x={x + 20} y={34} w={150} h={40} title="One login" />
          <line x1={x + 95} y1={74} x2={x + 95} y2={112} className="dStroke" />
          <polygon points={`${x + 95},120 ${x + 90.5},112 ${x + 99.5},112`} className="dHead" />
          <Box x={x + 20} y={120} w={150} h={54} title="One dashboard" sub="role switches inside" />
        </>
      ) : null}
      {shape === "split" ? (
        <>
          <Box x={x + 20} y={34} w={150} h={40} title="One login" />
          <path d={`M${x + 95},74 V94 H${x + 50} V112`} className="dStroke" />
          <path d={`M${x + 95},74 V94 H${x + 140} V112`} className="dStroke" />
          <polygon points={`${x + 50},120 ${x + 45.5},112 ${x + 54.5},112`} className="dHead" />
          <polygon points={`${x + 140},120 ${x + 135.5},112 ${x + 144.5},112`} className="dHead" />
          <Box x={x + 8} y={120} w={84} h={54} title="Teacher" sub="dashboard" />
          <Box x={x + 98} y={120} w={84} h={54} title="Student" sub="dashboard" />
        </>
      ) : null}
      {shape === "two" ? (
        <>
          <Box x={x + 8} y={34} w={84} h={46} title="Teacher" sub="login" />
          <Box x={x + 98} y={34} w={84} h={46} title="Student" sub="login" />
          <line x1={x + 50} y1={80} x2={x + 50} y2={112} className="dStroke" />
          <line x1={x + 140} y1={80} x2={x + 140} y2={112} className="dStroke" />
          <polygon points={`${x + 50},120 ${x + 45.5},112 ${x + 54.5},112`} className="dHead" />
          <polygon points={`${x + 140},120 ${x + 135.5},112 ${x + 144.5},112`} className="dHead" />
          <Box x={x + 8} y={120} w={84} h={54} title="Teacher" sub="dashboard" />
          <Box x={x + 98} y={120} w={84} h={54} title="Student" sub="dashboard" />
        </>
      ) : null}
    </g>
  );
}

function DaviloDiagram(props: DiagramProps) {
  return (
    <Frame {...props} height={190} title="The same question about who logs in, answered three different ways">
      <DaviloPanel x={2} label="First" shape="one" />
      <DaviloPanel x={222} label="Then" shape="split" />
      <DaviloPanel x={442} label="And then" shape="two" />
    </Frame>
  );
}

function CopilotDiagram(props: DiagramProps) {
  return (
    <Frame {...props} height={236} title="An AI suggestion is checked, then reviewed by the analyst, before anything happens">
      <RowLabel x={4} y={20} text="Every suggestion" />
      <Box x={4} y={32} title="A question" sub="in Persian or English" />
      <Box x={235} y={32} title="AI suggests" sub="never acts on its own" />
      <Box x={466} y={32} title="Automatic check" sub="does it hold up?" />
      <Arrow x1={174} x2={235} y={61} />
      <Arrow x1={405} x2={466} y={61} />

      <RowLabel x={4} y={150} text="Only then" />
      <Box x={4} y={162} title="It holds up" sub="shown as a preview" />
      <Box x={235} y={162} title="Analyst decides" sub="accept or change it" />
      <Box x={466} y={162} title="The result" sub="on the dashboard" tone="good" />
      <Arrow x1={174} x2={235} y={191} />
      <Arrow x1={405} x2={466} y={191} />
    </Frame>
  );
}

/* ------------------------------------------------------------------ */

const DIAGRAMS: Record<
  string,
  {
    render: (props: DiagramProps) => ReactElement;
    caption: string;
    /** The crop shown on the home-page card: the "after" row where there is one. */
    thumb: string;
  }
> = {
  "farakav-ai-copilot": {
    render: CopilotDiagram,
    thumb: "0 4 640 92",
    caption:
      "The AI only suggests. A suggestion that doesn’t hold up becomes a question for the analyst, and nothing happens until a person accepts it.",
  },
  "bajet-onboarding": {
    render: BajetDiagram,
    thumb: "0 136 640 92",
    caption:
      "Payment is the step that takes people away from the page. The journey has to bring them back to where they were.",
  },
  "bpmn-extensions": {
    render: BpmnDiagram,
    thumb: "0 136 640 92",
    caption:
      "A custom element should behave like a built-in one, so undo and validation keep working on it.",
  },
  "process-mining-performance": {
    render: FarakavDiagram,
    thumb: "0 136 640 92",
    caption:
      "Most of the wait was for something few people needed. The work now happens when someone asks for it.",
  },
  "davilo-lms": {
    render: DaviloDiagram,
    thumb: "0 4 640 178",
    caption:
      "Three shapes for the same product, and each change meant rebuilding it.",
  },
};

export function CaseDiagram({ slug }: { slug: string }) {
  const entry = DIAGRAMS[slug];
  if (!entry) return null;
  const Render = entry.render;
  return (
    <figure className="figure">
      <Render />
      <figcaption className="figureCaption">{entry.caption}</figcaption>
    </figure>
  );
}

/** The diagram without its caption, decorative; cropped to its thumbnail unless `full`. */
export function CaseThumb({ slug, full = false }: { slug: string; full?: boolean }) {
  const entry = DIAGRAMS[slug];
  if (!entry) return null;
  const Render = entry.render;
  return <Render viewBox={full ? undefined : entry.thumb} decorative />;
}
