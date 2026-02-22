// CareerList.jsx — List of career cards within a group
// Shows sortable career cards with key stats and a pick button.

import { useState } from "react";
import { formatDollars } from "../styles/theme";

// AI risk dot color: 1-3 green, 4-6 amber, 7-10 red
function aiDotColor(score) {
  if (score <= 3) return "#2e7d32";
  if (score <= 6) return "#f57f17";
  return "#c62828";
}

const SORT_OPTIONS = [
  { key: "typicalPeak", label: "Peak Pay", dir: "desc", fallback: "peakSalary" },
  { key: "satisfaction", label: "Happiness", dir: "desc" },
  { key: "hoursWeek", label: "Hours/Wk", dir: "asc" },
  { key: "oneInX", label: "Ease of Entry", dir: "asc" },
  { key: "burnout", label: "Low Burnout", dir: "asc" },
  { key: "aiRiskAvg", label: "AI Safe", dir: "asc" },
];

export default function CareerList({
  group,
  groupInfo,
  tracks,
  picks,
  onTogglePick,
  onBack,
  profColors,
}) {
  const [sortKey, setSortKey] = useState("typicalPeak");

  const sortOpt = SORT_OPTIONS.find((s) => s.key === sortKey) || SORT_OPTIONS[0];
  const getVal = (t, opt) => t[opt.key] || (opt.fallback ? t[opt.fallback] : 0) || 0;
  const sorted = [...tracks].sort((a, b) =>
    sortOpt.dir === "desc" ? getVal(b, sortOpt) - getVal(a, sortOpt) : getVal(a, sortOpt) - getVal(b, sortOpt)
  );

  const isPicked = (key) => picks.includes(key);

  return (
    <div style={{ padding: "0 8px" }}>
      {/* back + header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <button
          onClick={onBack}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#888",
            padding: "4px 8px",
          }}
        >
          &larr; Back
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 32 }}>{groupInfo.icon}</div>
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22,
            fontWeight: 800,
            color: "#1a1a2e",
          }}
        >
          {groupInfo.label}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#888",
            fontStyle: "italic",
          }}
        >
          {groupInfo.tagline} &mdash; {tracks.length} career{tracks.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* sort bar */}
      <div
        style={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortKey(opt.key)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 12,
              border: sortKey === opt.key ? "1px solid #D4A537" : "1px solid #ddd",
              background: sortKey === opt.key ? "#D4A537" : "white",
              color: sortKey === opt.key ? "white" : "#666",
              cursor: "pointer",
              fontWeight: sortKey === opt.key ? 700 : 500,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* career cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 440, margin: "0 auto" }}>
        {sorted.map((t) => {
          const picked = isPicked(t.key);
          const profColor = profColors[t.profession] || "#888";
          return (
            <div
              key={t.key}
              style={{
                background: picked ? `${t.color}08` : "white",
                borderRadius: 14,
                padding: "12px 14px",
                border: picked ? `2px solid ${t.color}40` : "1px solid #e8e8e8",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >
              {/* top row: name + profession + pick button */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#1a1a2e",
                      marginBottom: 2,
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: profColor,
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 11,
                        color: "#999",
                      }}
                    >
                      {t.profession}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onTogglePick(t.key)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 10,
                    border: picked ? `1px solid ${t.color}` : "1px solid #ddd",
                    background: picked ? t.color : "white",
                    color: picked ? "white" : "#888",
                    cursor: "pointer",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {picked ? "Picked" : "+ Pick"}
                </button>
              </div>

              {/* stats row */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px 12px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: "#555",
                }}
              >
                <span>💰 {t.typicalPeak && t.typicalPeak !== t.peakSalary
                  ? `${formatDollars(t.typicalPeak)}–${formatDollars(t.peakSalary)}`
                  : `${formatDollars(t.peakSalary)} peak`}</span>
                <span>⏰ {t.hoursWeek} hrs</span>
                <span>😊 {t.satisfaction}%</span>
                <span>🎯 1 in {t.oneInX} entry</span>
                <span>🔥 {t.burnout}% burnout</span>
                <span title={`AI risk: Now ${t.aiRiskNow || 5} · 5yr ${t.aiRiskMedium || 5} · 10yr ${t.aiRiskLong || 5}`}>
                  ⚡{" "}
                  {[t.aiRiskNow || 5, t.aiRiskMedium || 5, t.aiRiskLong || 5].map((s, i) => (
                    <span
                      key={i}
                      style={{
                        display: "inline-block",
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: aiDotColor(s),
                        margin: "0 1px",
                        verticalAlign: "middle",
                      }}
                    />
                  ))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
