// MoneyScoreboard.jsx — Salary bar chart + lifetime earnings cards
// Three key money numbers: starting salary, peak salary, lifetime earnings.

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CAREERS, styles } from "../styles/theme";

export default function MoneyScoreboard({ moneyData }) {
  // build the dataset Recharts needs — attach career name + color
  const barData = CAREERS.map((c) => {
    const m = moneyData.find((d) => d.key === c.key);
    return {
      name: c.name,
      shortName: c.name.split(" ").slice(0, 2).join(" "),
      start: m.start,
      peak: m.peak,
      lifetime: m.lifetime,
      color: c.color,
    };
  });

  return (
    <div style={{ padding: "12px 8px" }}>
      <h2 style={styles.header}>💰 The Money Scoreboard</h2>
      <p style={styles.subtitle}>Three key money numbers for each career</p>

      {/* ── bar chart: starting vs peak salary ── */}
      <h3
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: "#555",
          textAlign: "center",
          margin: "12px 0 8px",
        }}
      >
        Starting vs Peak Salary (per year)
      </h3>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={barData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="shortName"
            tick={{ fontSize: 9, fontFamily: "'DM Sans', sans-serif" }}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}
            tickFormatter={(v) => `$${v}K`}
            width={48}
          />
          <Tooltip
            contentStyle={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            }}
            formatter={(v) => [`$${v}K/year`]}
          />
          <Bar dataKey="start" name="Starting Salary" fill="#90CAF9" radius={[4, 4, 0, 0]} />
          <Bar dataKey="peak" name="Peak Salary" fill="#42A5F5" radius={[4, 4, 0, 0]} />
          <Legend wrapperStyle={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11 }} />
        </BarChart>
      </ResponsiveContainer>

      {/* ── lifetime earnings cards ── */}
      <h3
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: "#555",
          textAlign: "center",
          margin: "8px 0",
        }}
      >
        Total Money Earned by Age 65
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 8,
        }}
      >
        {CAREERS.map((c) => {
          const m = moneyData.find((d) => d.key === c.key);
          return (
            <div
              key={c.key}
              style={{
                background: "white",
                borderRadius: 12,
                padding: "14px 12px",
                textAlign: "center",
                border: `2px solid ${c.color}20`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.color,
                  marginBottom: 4,
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#1a1a2e",
                }}
              >
                ${(m.lifetime / 1000).toFixed(1)}M
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  color: "#999",
                }}
              >
                lifetime
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.soWhat}>
        💡 <strong>So What?</strong> Skin Cancer Surgeon earns $22.4M lifetime —
        almost 4x the Sports Foot Doctor ($6M). But the Foot Doctor starts working 2
        years sooner!
      </div>
    </div>
  );
}
