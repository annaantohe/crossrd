// GroupGrid.jsx — 2-column grid of group cards for the Explore tab
// Each card shows icon, label, count, salary range, and tagline.

import { formatDollars } from "../styles/theme";

export default function GroupGrid({ groups, allTracks, onSelectGroup }) {
  // build ordered list of groups with computed stats
  const groupList = Object.entries(groups).map(([slug, info]) => {
    const tracks = allTracks.filter((t) => t.group === slug);
    const peaks = tracks.map((t) => t.peakSalary || 0).filter(Boolean);
    return {
      slug,
      ...info,
      count: tracks.length,
      minPay: peaks.length ? Math.min(...peaks) : 0,
      maxPay: peaks.length ? Math.max(...peaks) : 0,
    };
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10,
        maxWidth: 440,
        margin: "0 auto",
        padding: "0 8px",
      }}
    >
      {groupList.map((g) => (
        <button
          key={g.slug}
          onClick={() => onSelectGroup(g.slug)}
          style={{
            background: "white",
            borderRadius: 14,
            padding: "14px 12px",
            border: "1px solid #e8e8e8",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 6 }}>{g.icon}</div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#1a1a2e",
              marginBottom: 2,
            }}
          >
            {g.label}
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "#999",
              marginBottom: 6,
            }}
          >
            {g.count} career{g.count !== 1 ? "s" : ""} &bull;{" "}
            {g.minPay === g.maxPay
              ? formatDollars(g.minPay)
              : `${formatDollars(g.minPay)}-${formatDollars(g.maxPay)}`}{" "}
            peak
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "#888",
              fontStyle: "italic",
              lineHeight: 1.3,
            }}
          >
            {g.tagline}
          </div>
        </button>
      ))}
    </div>
  );
}
