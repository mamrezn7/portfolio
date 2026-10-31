import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ShapeKind } from "@/content/case-studies";

/**
 * The social-card renderer behind every opengraph-image route. Runs at build
 * time only (static export), so it can read fonts and the PNG stills from
 * disk. The stills are PNG and the fonts are fixed instances because the
 * renderer reads neither WebP nor variable fonts.
 */

export const ogSize = { width: 1200, height: 630 };

const STONE = "#f2f1ee";
const INK = "#111214";
const MUTED = "#55575c";
const RED = "#d10a14";

const read = (path: string) => readFile(join(process.cwd(), path));

async function fonts() {
  const [wide, text] = await Promise.all([
    read("assets/fonts/TikTokSans-WideHeavy.woff"),
    read("assets/fonts/TikTokSans-Medium.woff"),
  ]);
  return [
    { name: "Wide", data: wide, style: "normal" as const, weight: 800 as const },
    { name: "Text", data: text, style: "normal" as const, weight: 500 as const },
  ];
}

async function art(name: "hero" | ShapeKind) {
  return `data:image/png;base64,${(await read(`assets/og/${name}.png`)).toString("base64")}`;
}

export async function ogImage({
  title,
  size,
  sub,
  metric,
  footer,
  image,
}: {
  /** Set in the wide face, uppercase. */
  title: string;
  size: number;
  sub: string;
  metric?: { value: string; label: string };
  footer: string;
  image: "hero" | ShapeKind;
}) {
  const src = await art(image);
  const hero = image === "hero";
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: STONE, color: INK }}>
        <div style={{ display: "flex", height: 14, background: RED }} />
        <div style={{ display: "flex", flex: 1, padding: "48px 60px 52px" }}>
          <div style={{ display: "flex", flexDirection: "column", width: hero ? 720 : 700, height: "100%" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Wide",
                fontSize: size,
                lineHeight: 0.9,
                textTransform: "uppercase",
                letterSpacing: -1,
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex", marginTop: 26, fontFamily: "Text", fontSize: 30, lineHeight: 1.3, color: INK }}>{sub}</div>
            {metric ? (
              <div style={{ display: "flex", alignItems: "baseline", marginTop: 26 }}>
                <span style={{ fontFamily: "Wide", fontSize: 76, color: RED, lineHeight: 1 }}>{metric.value}</span>
                <span style={{ fontFamily: "Text", fontSize: 24, color: MUTED, marginLeft: 18 }}>{metric.label}</span>
              </div>
            ) : null}
            <div style={{ display: "flex", marginTop: "auto", fontFamily: "Text", fontSize: 24, color: MUTED }}>{footer}</div>
          </div>
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" width={hero ? 380 : 400} height={hero ? 436 : 300} />
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
