import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050816 0%, #0a0e27 50%, #050816 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(30,41,59,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.4) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Top-left glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,249,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Bottom-right glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Corner accents */}
        <div style={{ position: "absolute", top: "24px", left: "24px", width: "40px", height: "40px", borderTop: "2px solid #00fff9", borderLeft: "2px solid #00fff9" }} />
        <div style={{ position: "absolute", top: "24px", right: "24px", width: "40px", height: "40px", borderTop: "2px solid #00fff9", borderRight: "2px solid #00fff9" }} />
        <div style={{ position: "absolute", bottom: "24px", left: "24px", width: "40px", height: "40px", borderBottom: "2px solid #00fff9", borderLeft: "2px solid #00fff9" }} />
        <div style={{ position: "absolute", bottom: "24px", right: "24px", width: "40px", height: "40px", borderBottom: "2px solid #00fff9", borderRight: "2px solid #00fff9" }} />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          {/* Available badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 18px",
              borderRadius: "999px",
              border: "1px solid rgba(0,255,249,0.4)",
              background: "rgba(0,255,249,0.08)",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#00fff9",
                boxShadow: "0 0 8px #00fff9",
              }}
            />
            <span
              style={{
                color: "#00fff9",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              Available for Projects
            </span>
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: "80px",
              fontWeight: 900,
              letterSpacing: "-2px",
              lineHeight: 1,
              marginBottom: "16px",
              color: "#ffffff",
            }}
          >
            Abdo{" "}
            <span style={{ color: "#00fff9" }}>Raquibi</span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "26px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "2px",
              marginBottom: "36px",
              textTransform: "uppercase",
            }}
          >
            Full-Stack Web Developer
          </div>

          {/* Divider */}
          <div
            style={{
              width: "120px",
              height: "2px",
              background: "#00fff9",
              marginBottom: "32px",
              opacity: 0.6,
            }}
          />

          {/* Tech stack pills */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            {["Laravel", "React", "Next.js", "Node.js", "TypeScript"].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,255,249,0.3)",
                  background: "rgba(0,255,249,0.07)",
                  color: "#a5f3fc",
                  fontSize: "15px",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            color: "rgba(0,255,249,0.45)",
            fontSize: "15px",
            letterSpacing: "3px",
            fontFamily: "monospace",
          }}
        >
          raquibi.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
