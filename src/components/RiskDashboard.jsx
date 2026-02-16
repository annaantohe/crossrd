// RiskDashboard.jsx — Stress test color-coded grid
// Shows how well each selected career survives 4 bad scenarios.

import { styles } from "../styles/theme";
import CareerSelector from "./CareerSelector";

// scenario columns
const SCENARIOS = [
  { key: "ai", label: "AI Takes Job" },
  { key: "pay", label: "Pay Cut 20%" },
  { key: "injury", label: "Hurt Hands" },
  { key: "match", label: "Not Accepted" },
  { key: "avg", label: "Toughness" },
];

// color a cell green/yellow/red based on the score
function cellColor(v) {
  if (v >= 7) return { bg: "#e8f5e9", color: "#2e7d32" };
  if (v >= 4) return { bg: "#fff8e1", color: "#f57f17" };
  return { bg: "#ffebee", color: "#c62828" };
}

export default function RiskDashboard({ stressData, careers, selectorProps }) {
  const { scenarios, scores } = stressData;

  return (
    <div style={{ padding: "12px 4px" }}>
      <h2 style={styles.header}>What Could Go Wrong?</h2>
      <p style={styles.subtitle}>
        How well each career survives 4 bad scenarios (10 = safest)
      </p>

      <CareerSelector {...selectorProps} />

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

      <div style={styles.soWhat}>
        💡 <strong>So What?</strong> Every career has a weakness. Some are AI-proof, others
        survive pay cuts better. Use the selector to compare risks across any careers!
      </div>
    </div>
  );
}
