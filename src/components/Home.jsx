// Home.jsx — Landing page
// Shows the big headline, key stats pulled from JSON meta, and profession cards.

import { PROF_COLORS, PROF_LABELS } from "../styles/theme";

export default function Home({ meta, professions, allTracks }) {
  // stats come straight from the JSON metadata
  const stats = [
    [String(meta.total_tracks), "careers evaluated"],
    [String(meta.data_points), "data points"],
    [String(meta.finalists), "finalists"],
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px 16px 40px" }}>
      {/* big icon */}
      <div style={{ fontSize: 56, marginBottom: 8 }}>🩺</div>

      {/* main headline */}
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(28px, 6vw, 44px)",
          fontWeight: 800,
          color: "#1a1a2e",
          lineHeight: 1.15,
          margin: "0 0 12px",
        }}
      >
        Which Doctor
        <br />
        Should You Become?
      </h1>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(14px, 3vw, 18px)",
          color: "#666",
          margin: "0 0 28px",
          letterSpacing: "0.02em",
        }}
      >
        A Data-Driven Guide
      </p>

      {/* stat boxes */}
      <div
        style={{
          display: "inline-flex",
          gap: 24,
          justifyContent: "center",
          flexWrap: "wrap",
          background: "linear-gradient(135deg, #f8f6f1, #f0ece3)",
          borderRadius: 16,
          padding: "16px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {stats.map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 32,
                fontWeight: 800,
                color: "#D4A537",
              }}
            >
              {num}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* profession cards — one per doctor type */}
      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 8,
          maxWidth: 400,
          margin: "24px auto 0",
        }}
      >
        {Object.entries(PROF_COLORS).map(([prof, color]) => (
          <div
            key={prof}
            style={{
              background: "white",
              borderRadius: 12,
              padding: "10px 12px",
              borderLeft: `4px solid ${color}`,
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                color: "#1a1a2e",
              }}
            >
              {PROF_LABELS[prof]}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: "#999",
                marginTop: 2,
              }}
            >
              {prof} &bull;{" "}
              {allTracks.filter((t) => t.profession === prof).length} specialties
            </div>
          </div>
        ))}
      </div>

      <p
        style={{
          marginTop: 20,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#aaa",
          fontStyle: "italic",
        }}
      >
        Start with &ldquo;🏟️ All 42&rdquo; to see every career, or explore the
        finalist tabs &rarr;
      </p>
    </div>
  );
}
