// Scorecard.jsx — 6-dimension radar chart
// Compares selected careers on Money, Happiness, Free Time, etc.

import { useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { styles } from "../styles/theme";

// reusable career toggle buttons
function ToggleBar({ careers, visible, toggle }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        justifyContent: "center",
        marginBottom: 12,
      }}
    >
      {careers.map((c) => (
        <button
          key={c.key}
          onClick={() => toggle(c.key)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            padding: "5px 10px",
            borderRadius: 20,
            border: `2px solid ${c.color}`,
            cursor: "pointer",
            background: visible[c.key] ? c.color : "white",
            color: visible[c.key] ? "white" : c.color,
            fontWeight: 600,
            opacity: visible[c.key] ? 1 : 0.5,
            transition: "all 0.2s",
          }}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}

export default function Scorecard({ radarDimensions, careers, selectorProps }) {
  // start with all selected careers visible
  const [visible, setVisible] = useState(() =>
    Object.fromEntries(careers.map((c) => [c.key, true]))
  );

  const toggle = (k) => setVisible((prev) => ({ ...prev, [k]: !prev[k] }));

  // build the data array Recharts expects — combine emoji + dim for the axis label
  const chartData = radarDimensions.map((d) => ({
    ...d,
    dim: `${d.emoji} ${d.dim}`,
  }));

  return (
    <div style={{ padding: "12px 8px" }}>
      <h2 style={styles.header}>Career Scorecard</h2>
      <p style={styles.subtitle}>6 dimensions rated 1-10 (tap careers to compare)</p>

      <ToggleBar careers={careers} visible={visible} toggle={toggle} />

      <ResponsiveContainer width="100%" height={320}>
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
          <PolarGrid stroke="#ddd" />
          <PolarAngleAxis
            dataKey="dim"
            tick={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fill: "#555" }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 9 }} tickCount={6} />
          {careers.map(
            (c) =>
              visible[c.key] && (
                <Radar
                  key={c.key}
                  name={c.name}
                  dataKey={c.key}
                  stroke={c.color}
                  fill={c.color}
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              )
          )}
        </RadarChart>
      </ResponsiveContainer>

      <div style={styles.soWhat}>
        💡 <strong>So What?</strong> No career wins everywhere. Pick what matters most to
        you — money, happiness, work-life balance, or job security!
      </div>
    </div>
  );
}
