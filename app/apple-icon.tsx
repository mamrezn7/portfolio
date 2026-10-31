import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Static export: rendered once at build time.
export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const serif = await readFile(join(process.cwd(), "assets/fonts/InstrumentSerif-Regular.woff"));
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#17150f",
          color: "#f5efe3",
          fontFamily: "Serif",
          fontSize: 128,
          paddingBottom: 12,
        }}
      >
        M
      </div>
    ),
    { ...size, fonts: [{ name: "Serif", data: serif, style: "normal", weight: 400 }] },
  );
}
