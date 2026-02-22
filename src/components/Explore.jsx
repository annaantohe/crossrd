// Explore.jsx — Browse careers by group, with table/scatter fallback
// Level 1: branding + group grid (home)
// Level 2: career list for a selected group
// Toggle: "View All as Table" shows the FullField table/scatter

import { useState } from "react";
import GroupGrid from "./GroupGrid";
import CareerList from "./CareerList";
import FullField from "./FullField";

export default function Explore({
  meta,
  groups,
  allTracks,
  profColors,
  profLabels,
  picks,
  onTogglePick,
}) {
  const [activeGroup, setActiveGroup] = useState(null); // null = grid, "surgery" = drill in
  const [showTable, setShowTable] = useState(false);

  // when showing the full table
  if (showTable) {
    return (
      <div>
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <button
            onClick={() => setShowTable(false)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              padding: "6px 16px",
              borderRadius: 16,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
              color: "#666",
            }}
          >
            &larr; Back to Groups
          </button>
        </div>
        <FullField allTracks={allTracks} profColors={profColors} profLabels={profLabels} />
      </div>
    );
  }

  // when drilling into a specific group
  if (activeGroup) {
    const groupInfo = groups[activeGroup] || {};
    const groupTracks = allTracks.filter((t) => t.group === activeGroup);
    return (
      <div style={{ padding: "8px 0" }}>
        <CareerList
          group={activeGroup}
          groupInfo={groupInfo}
          tracks={groupTracks}
          picks={picks}
          onTogglePick={onTogglePick}
          onBack={() => setActiveGroup(null)}
          profColors={profColors}
        />
      </div>
    );
  }

  // default: branding + stats + group grid
  const stats = [
    [String(meta.total_tracks), "careers scored"],
    [String(meta.data_points), "data points each"],
    [String(Object.keys(groups).length), "groups"],
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px 8px 80px" }}>
      {/* field badge */}
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

      {/* subtitle + disclaimer (shown when present, e.g. AI & Future) */}
      {meta.subtitle && meta.subtitle !== "A Data-Driven Guide" && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#666",
            margin: "0 0 4px",
          }}
        >
          {meta.subtitle}
        </p>
      )}
      {meta.note && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#999",
            fontStyle: "italic",
            margin: "0 auto 16px",
            maxWidth: 400,
            lineHeight: 1.4,
          }}
        >
          {meta.note}
        </p>
      )}

      {/* stat boxes */}
      <div
        style={{
          display: "inline-flex",
          gap: 24,
          justifyContent: "center",
          flexWrap: "wrap",
          background: "linear-gradient(135deg, #f8f6f1, #f0ece3)",
          borderRadius: 16,
          padding: "14px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: 20,
        }}
      >
        {stats.map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#D4A537",
              }}
            >
              {num}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
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

      {/* group grid */}
      <GroupGrid groups={groups} allTracks={allTracks} onSelectGroup={setActiveGroup} />

      {/* table toggle */}
      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => setShowTable(true)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            padding: "8px 20px",
            borderRadius: 20,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
            color: "#888",
          }}
        >
          📋 View All {meta.total_tracks} as Table
        </button>
      </div>
    </div>
  );
}
