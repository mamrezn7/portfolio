import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Static export: rendered once at build time.
export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const wide = await readFile(join(process.cwd(), "assets/fonts/TikTokSans-WideHeavy.woff"));
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#d10a14",
          color: "#ffffff",
          fontFamily: "Wide",
          fontSize: 120,
          paddingBottom: 6,
        }}
      >
        M
      </div>
    ),
    { ...size, fonts: [{ name: "Wide", data: wide, style: "normal", weight: 800 }] },
  );
}
