import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ShapeKind } from "@/content/case-studies";

/**
 * The social-card renderer behind every opengraph-image route. Runs at build
 * time only (static export), so it can read fonts and the PNG stills from
 * disk. The stills are PNG because the renderer cannot read WebP.
 */

export const ogSize = { width: 1200, height: 630 };

const PAPER = "#f5efe3";
const INK = "#17150f";
const SOFT = "#57524a";
const RUST = "#9a4a1e";

const read = (path: string) => readFile(join(process.cwd(), path));

async function fonts() {
  const [serif, italic, mono] = await Promise.all([
    read("assets/fonts/InstrumentSerif-Regular.woff"),
    read("assets/fonts/InstrumentSerif-Italic.woff"),
    read("assets/fonts/IBMPlexMono-Medium.woff"),
  ]);
  return [
    { name: "Serif", data: serif, style: "normal" as const, weight: 400 as const },
    { name: "Serif", data: italic, style: "italic" as const, weight: 400 as const },
    { name: "Mono", data: mono, style: "normal" as const, weight: 500 as const },
  ];
}

async function art(name: "hero" | ShapeKind) {
  return `data:image/png;base64,${(await read(`assets/og/${name}.png`)).toString("base64")}`;
}

type Line = { text: string; em?: boolean };

export async function ogImage({
  kicker,
  lines,
  size,
  metric,
  footer,
  image,
}: {
  kicker: string;
  lines: Line[];
  size: number;
  metric?: { value: string; label: string };
  footer: string;
  image: "hero" | ShapeKind;
}) {
  const src = await art(image);
  const hero = image === "hero";
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: PAPER, color: INK, padding: "56px 64px" }}>
        <div style={{ display: "flex", flexDirection: "column", width: hero ? 700 : 690, height: "100%" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Mono",
              fontSize: 20,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: SOFT,
              borderBottom: `2px solid ${INK}`,
              paddingBottom: 18,
            }}
          >
            {kicker}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 34, fontFamily: "Serif", fontSize: size, lineHeight: 1 }}>
            {lines.map((l) => (
              <span key={l.text} style={{ fontStyle: l.em ? "italic" : "normal", color: l.em ? RUST : INK }}>
                {l.text}
              </span>
            ))}
          </div>
          {metric ? (
            <div style={{ display: "flex", alignItems: "baseline", marginTop: 28 }}>
              <span style={{ fontFamily: "Serif", fontSize: 96, color: RUST, lineHeight: 1 }}>{metric.value}</span>
              <span style={{ fontFamily: "Mono", fontSize: 18, color: SOFT, marginLeft: 18, textTransform: "uppercase", letterSpacing: 1.5 }}>
                {metric.label}
              </span>
            </div>
          ) : null}
          <div style={{ display: "flex", marginTop: "auto", fontFamily: "Serif", fontSize: 34 }}>{footer}</div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" width={hero ? 452 : 420} height={hero ? 518 : 315} />
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
