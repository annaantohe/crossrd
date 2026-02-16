// Home.jsx — Landing page
// crossrd brand + current field overview + profession cards.

export default function Home({ meta, professions, profColors, profLabels, allTracks }) {
  const stats = [
    [String(meta.total_tracks), "careers scored"],
    [String(meta.data_points), "data points each"],
    [String(meta.finalists), "finalists"],
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px 16px 40px" }}>
      {/* crossrd brand */}
      <div
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(40px, 10vw, 64px)",
          fontWeight: 800,
          color: "#1a1a2e",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          margin: "0 0 4px",
        }}
      >
        cross<span style={{ color: "#D4A537" }}>rd</span>
      </div>

      {/* main tagline */}
      <h1
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(18px, 4.5vw, 26px)",
          fontWeight: 600,
          color: "#1a1a2e",
          lineHeight: 1.3,
          margin: "0 0 6px",
        }}
      >
        what should i actually be when i grow up?
      </h1>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(13px, 3vw, 16px)",
          color: "#999",
          margin: "0 0 24px",
          fontStyle: "italic",
        }}
      >
        we overthought it so you don't have to
      </p>

      {/* current field badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "white",
          borderRadius: 20,
          padding: "6px 16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid #eee",
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 20 }}>{meta.icon || "📊"}</span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#1a1a2e",
          }}
        >
          {meta.headline || "Career Guide"}
        </span>
      </div>

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

      {/* profession cards */}
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 8,
          maxWidth: 400,
          margin: "20px auto 0",
        }}
      >
        {Object.entries(profColors).map(([prof, color]) => (
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
              {profLabels[prof]}
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
        tap &ldquo;🏟️ All {allTracks.length}&rdquo; to see every career, or
        explore the tabs &rarr;
      </p>
    </div>
  );
}
