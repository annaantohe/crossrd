// RiskDashboard.jsx — Stress test color-coded grid + AI Forecast
// Shows how well each selected career survives 4 bad scenarios,
// plus a 3-horizon AI displacement forecast with narratives.

import { styles } from "../styles/theme";

// scenario columns
const SCENARIOS = [
  { key: "ai", label: "AI Takes Job" },
  { key: "pay", label: "Pay Cut 20%" },
  { key: "injury", label: "Hurt Hands" },
  { key: "match", label: "Not Accepted" },
  { key: "avg", label: "Toughness" },
];

// color a cell green/yellow/red based on the score (higher = safer)
function cellColor(v) {
  if (v >= 7) return { bg: "#e8f5e9", color: "#2e7d32" };
  if (v >= 4) return { bg: "#fff8e1", color: "#f57f17" };
  return { bg: "#ffebee", color: "#c62828" };
}

// AI risk dot color (higher = MORE at risk, so reversed from stress)
function aiDotColor(score) {
  if (score <= 3) return "#2e7d32";
  if (score <= 6) return "#f57f17";
  return "#c62828";
}

function aiDotBg(score) {
  if (score <= 3) return "#e8f5e9";
  if (score <= 6) return "#fff8e1";
  return "#ffebee";
}

const HORIZONS = [
  { key: "aiRiskNow", label: "Now" },
  { key: "aiRiskMedium", label: "5yr" },
  { key: "aiRiskLong", label: "10yr" },
];

export default function RiskDashboard({ stressData, careers, selectorProps, tracks }) {
  const { scenarios, scores } = stressData;

  // look up AI risk data from tracks
  const aiForecasts = careers.map((c) => {
    const track = tracks?.find((t) => t.key === c.key);
    return {
      key: c.key,
      name: c.name,
      color: c.color,
      aiRiskNow: track?.raw_data?.aiRiskNow || 5,
      aiRiskMedium: track?.raw_data?.aiRiskMedium || 5,
      aiRiskLong: track?.raw_data?.aiRiskLong || 5,
      aiNarrative: track?.raw_data?.aiNarrative || "",
    };
  });

  return (
    <div style={{ padding: "12px 4px" }}>
      <h2 style={styles.header}>What Could Go Wrong?</h2>
      <p style={styles.subtitle}>
        How well each career survives 4 bad scenarios (10 = safest)
      </p>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 3,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            minWidth: 520,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "6px 4px",
                  fontSize: 10,
                  color: "#888",
                }}
              >
                Career
              </th>
              {SCENARIOS.map((s) => (
                <th
                  key={s.key}
                  style={{
                    padding: "6px 4px",
                    fontSize: 10,
                    color: "#555",
                    textAlign: "center",
                    lineHeight: 1.2,
                    maxWidth: 72,
                  }}
                >
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {scores.map((r) => {
              const career = careers.find((c) => c.key === r.key);

              return (
                <tr key={r.key}>
                  {/* career name */}
                  <td
                    style={{
                      padding: "6px 4px",
                      fontWeight: 700,
                      color: career?.color || "#555",
                      whiteSpace: "nowrap",
                      fontSize: 11,
                    }}
                  >
                    {career?.name || r.key}
                  </td>

                  {/* scenario scores */}
                  {SCENARIOS.map((s) => {
                    const val = r[s.key];
                    const c = cellColor(val);

                    return (
                      <td
                        key={s.key}
                        style={{
                          textAlign: "center",
                          padding: "8px 4px",
                          borderRadius: 8,
                          background: s.key === "avg" ? "#f3e8ff" : c.bg,
                          color: s.key === "avg" ? "#6b21a8" : c.color,
                          fontWeight: s.key === "avg" ? 800 : 700,
                          fontSize: s.key === "avg" ? 14 : 12,
                        }}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── AI Forecast Section ── */}
      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 18,
          fontWeight: 800,
          color: "#1a1a2e",
          textAlign: "center",
          margin: "24px 0 4px",
        }}
      >
        ⚡ AI Forecast
      </h3>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          color: "#888",
          textAlign: "center",
          margin: "0 0 12px",
        }}
      >
        How likely AI is to change or displace this career (1 = safe, 10 = high risk)
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        {aiForecasts.map((f) => (
          <div
            key={f.key}
            style={{
              background: "white",
              borderRadius: 12,
              padding: "12px 14px",
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            {/* career name */}
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: f.color || "#1a1a2e",
                marginBottom: 8,
              }}
            >
              {f.name}
            </div>

            {/* 3-horizon dots row */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 8,
              }}
            >
              {HORIZONS.map((h) => {
                const score = f[h.key];
                return (
                  <div
                    key={h.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 10,
                        color: "#999",
                        fontWeight: 600,
                        width: 28,
                      }}
                    >
                      {h.label}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: aiDotColor(score),
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: aiDotColor(score),
                        background: aiDotBg(score),
                        padding: "1px 6px",
                        borderRadius: 6,
                      }}
                    >
                      {score}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* narrative */}
            {f.aiNarrative && (
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: "#666",
                  fontStyle: "italic",
                  lineHeight: 1.4,
                }}
              >
                {f.aiNarrative}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* legend */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          color: "#999",
          textAlign: "center",
          marginTop: 10,
        }}
      >
        <span style={{ color: "#2e7d32" }}>●</span> 1-3 low risk{" "}
        <span style={{ color: "#f57f17" }}>●</span> 4-6 moderate{" "}
        <span style={{ color: "#c62828" }}>●</span> 7-10 high risk
      </div>

      <div style={styles.soWhat}>
        💡 <strong>So What?</strong> Every career has a weakness. Some are AI-proof, others
        survive pay cuts better. The AI forecast shows how risk evolves over the next decade.
      </div>
    </div>
  );
}
