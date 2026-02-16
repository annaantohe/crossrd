// RaceToMillion.jsx — Net worth line chart (age 18–65)
// Shows how each selected career's total savings grow over a career.

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
import CareerSelector from "./CareerSelector";

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

      <CareerSelector {...selectorProps} />
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
            contentStyle={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            }}
            formatter={(v, name) => [
              formatDollars(v),
              careers.find((c) => c.key === name)?.name,
            ]}
            labelFormatter={(l) => `Age ${l}`}
          />
          {careers.map(
            (c) =>
              visible[c.key] && (
                <Line
                  key={c.key}
                  type="monotone"
                  dataKey={c.key}
                  stroke={c.color}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  name={c.key}
                />
              )
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* milestone badges */}
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

      <div style={styles.soWhat}>
        💡 <strong>So What?</strong> Different paths start earning at different ages. Use
        the career selector above to compare any careers side by side!
      </div>
    </div>
  );
}
