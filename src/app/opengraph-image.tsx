import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #661a26 0%, #4f1420 100%)",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#F7EFE4",
            letterSpacing: -2,
          }}
        >
          Delice
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 32,
            color: "#F7EFE4",
            opacity: 0.85,
          }}
        >
          Slice of Happiness
        </div>
      </div>
    ),
    { ...size }
  );
}
