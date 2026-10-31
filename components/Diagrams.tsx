/**
 * Mechanism diagrams, one per case study.
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
    <Frame {...props} height={236} title="How the payment tab lost the user's place, and how the channel returned it">
      <RowLabel x={4} y={20} text="What happened" />
      <Box x={4} y={32} title="Tab A" sub="step 4 of 6" />
      <Box x={235} y={32} title="Tab B" sub="payment gateway" />
      <Box x={466} y={32} title="Tab A" sub="back at step 1" tone="bad" />
      <Arrow x1={174} x2={235} y={61} label="opens" />
      <Arrow x1={405} x2={466} y={61} label="callback" />

      <RowLabel x={4} y={150} text="What we shipped" />
      <Box x={4} y={162} title="Tab A" sub="step 4 of 6" />
      <Box x={235} y={162} title="Tab B" sub="payment gateway" />
      <Box x={466} y={162} title="Tab A" sub="continues at step 5" tone="good" />
      <Arrow x1={174} x2={235} y={191} label="opens" />
      <Arrow x1={405} x2={466} y={191} label="channel" tone="accent" />
    </Frame>
  );
}

function BpmnDiagram(props: DiagramProps) {
  return (
    <Frame {...props} height={236} title="Why a custom element must go through the command stack">
      <RowLabel x={4} y={20} text="Painted on top" />
      <Box x={4} y={32} title="Custom node" sub="drawn over the canvas" />
      <Box x={235} y={32} title="Ctrl + Z" sub="diagram reverts" />
      <Box x={466} y={32} title="Node survives" sub="model and view disagree" tone="bad" />
      <Arrow x1={174} x2={235} y={61} />
      <Arrow x1={405} x2={466} y={61} />

      <RowLabel x={4} y={150} text="Through the module system" />
      <Box x={4} y={162} title="Custom node" sub="registered as a module" />
      <Box x={235} y={162} title="Ctrl + Z" sub="command stack reverts" />
      <Box x={466} y={162} title="Node reverts too" sub="model and XML agree" tone="good" />
      <Arrow x1={174} x2={235} y={191} />
      <Arrow x1={405} x2={466} y={191} />
    </Frame>
  );
}

function FarakavDiagram(props: DiagramProps) {
  return (
    <Frame {...props} height={236} title="Hundreds of per-field queries replaced by one query on click">
      <RowLabel x={4} y={20} text="Before" />
      <Box x={4} y={32} title="One list request" sub="from the client" />
      <Box x={235} y={32} title="Query per field" sub="hundreds per response" />
      <Box x={466} y={32} title="Up to two minutes" sub="for detail nobody opened" tone="bad" />
      <Arrow x1={174} x2={235} y={61} />
      <Arrow x1={405} x2={466} y={61} />

      <RowLabel x={4} y={150} text="After" />
      <Box x={4} y={162} title="One list request" sub="from the client" />
      <Box x={235} y={162} title="The list only" sub="no per-field work" />
      <Box x={466} y={162} title="One detail query" sub="on the item you clicked" tone="good" />
      <Arrow x1={174} x2={235} y={191} />
      <Arrow x1={405} x2={466} y={191} label="on click" tone="accent" />
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
    <Frame {...props} height={236} title="An AI proposal is checked against the real metadata, then approved, before it runs">
      <RowLabel x={4} y={20} text="Every proposal" />
      <Box x={4} y={32} title="A question" sub="in Persian or English" />
      <Box x={235} y={32} title="Model proposes" sub="column and measure ids" />
      <Box x={466} y={32} title="Metadata check" sub="does every id exist?" />
      <Arrow x1={174} x2={235} y={61} label="tools only" />
      <Arrow x1={405} x2={466} y={61} />

      <RowLabel x={4} y={150} text="Only then" />
      <Box x={4} y={162} title="All ids exist" sub="shown as a preview" />
      <Box x={235} y={162} title="Analyst approves" sub="nothing runs before" />
      <Box x={466} y={162} title="Query engine" sub="same path as any visual" tone="good" />
      <Arrow x1={174} x2={235} y={191} />
      <Arrow x1={405} x2={466} y={191} label="approve" tone="accent" />
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
      "The model only proposes. Its proposal is checked against the real metadata, and an id that does not exist turns it into a clarifying question. An approved proposal runs through the same query engine as a visual built by hand.",
  },
  "bajet-onboarding": {
    render: BajetDiagram,
    thumb: "0 136 640 92",
    caption:
      "The gateway callback returned to the base URL instead of the step that opened it, and step state lived in the client. The channel carries the result back to the tab that still knows where the user was.",
  },
  "bpmn-extensions": {
    render: BpmnDiagram,
    thumb: "0 136 640 92",
    caption:
      "A custom element drawn over the canvas sits outside the diagram's history. Registered through the module system, the same element is undone, validated and serialised by the code that handles every built-in element.",
  },
  "process-mining-performance": {
    render: FarakavDiagram,
    thumb: "0 136 640 92",
    caption:
      "A query for every field in the response, producing detail that was only read after a click. The work was needed, just too early.",
  },
  "davilo-lms": {
    render: DaviloDiagram,
    thumb: "0 4 640 178",
    caption:
      "Three shapes for the same product. Each has its own routing, session handling and component boundaries, so redrawing it meant rebuilding it.",
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
