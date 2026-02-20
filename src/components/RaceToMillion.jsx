// RaceToMillion.jsx — Net worth line chart (age 18–65)
// Shows each career's typical trajectory + ceiling trajectory as a band.

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatDollars, styles } from "../styles/theme";

// reusable toggle bar for picking which careers are visible
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

// milestone badges shown below the chart
const MILESTONES = [
  { age: 18, label: "Start College", bg: "#e3f2fd" },
  { age: 22, label: "Start School", bg: "#fff3e0" },
  { age: "29-31", label: "Real Doctor!", bg: "#e8f5e9" },
  { age: "33-40", label: "Loans Paid Off", bg: "#fce4ec" },
];

export default function RaceToMillion({ netWorthData, careers, selectorProps }) {
  // all careers on by default
  const [visible, setVisible] = useState(() =>
    Object.fromEntries(careers.map((c) => [c.key, true]))
  );

  const toggle = (k) => setVisible((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div style={{ padding: "12px 8px" }}>
      <h2 style={styles.header}>The Race to a Million</h2>
      <p style={styles.subtitle}>Total money saved over a lifetime (age 18-65)</p>

      <ToggleBar careers={careers} visible={visible} toggle={toggle} />

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={netWorthData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="age"
            tick={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}
            tickFormatter={(v) => formatDollars(v)}
            width={52}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              // group entries by career (typical + ceiling)
              const grouped = {};
              for (const entry of payload) {
                const base = entry.dataKey.replace(/_ceiling$/, "");
                if (!grouped[base]) grouped[base] = { color: entry.color };
                if (entry.dataKey.endsWith("_ceiling")) {
                  grouped[base].ceiling = entry.value;
                } else {
                  grouped[base].typical = entry.value;
                  grouped[base].color = entry.color;
                }
              }
              return (
                <div
                  style={{
                    background: "white",
                    padding: "8px 12px",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>Age {label}</div>
                  {Object.entries(grouped).map(([key, vals]) => {
                    const career = careers.find((c) => c.key === key);
                    return (
                      <div key={key} style={{ color: vals.color, marginBottom: 2 }}>
                        <strong>{career?.name || key}:</strong> {formatDollars(vals.typical)}
                        {vals.ceiling != null && vals.ceiling !== vals.typical && (
                          <span style={{ opacity: 0.5 }}> · ceiling {formatDollars(vals.ceiling)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />
          {careers.map(
            (c) =>
              visible[c.key] && [
                <Line
                  key={c.key}
                  type="monotone"
                  dataKey={c.key}
                  stroke={c.color}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  name={c.key}
                />,
                <Line
                  key={`${c.key}_ceiling`}
                  type="monotone"
                  dataKey={`${c.key}_ceiling`}
                  stroke={c.color}
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  dot={false}
                  opacity={0.35}
                  name={`${c.key}_ceiling`}
                />,
              ]
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* milestone badges (only for single-family) */}
      {new Set(careers.map((c) => c.family).filter(Boolean)).size <= 1 && (
        <div
          style={{
            margin: "8px 8px 0",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            justifyContent: "center",
          }}
        >
          {MILESTONES.map((m) => (
            <span
              key={m.label}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                padding: "4px 8px",
                borderRadius: 8,
                background: m.bg,
                whiteSpace: "nowrap",
              }}
            >
              Age {m.age}: {m.label}
            </span>
          ))}
        </div>
      )}

      <div style={styles.soWhat}>
        💡 <strong>So What?</strong> Solid lines show what most people earn. Dashed lines
        show the ceiling — a wider gap means more upside but less predictability.
      </div>
    </div>
  );
}
