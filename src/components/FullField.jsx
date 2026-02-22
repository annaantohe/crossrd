// FullField.jsx — "All 64" table + scatter plot with toggle
// Sortable columns, profession filter buttons, and color-coded cells.

import { useState, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { styles } from "../styles/theme";

// AI risk dot color: 1-3 green, 4-6 amber, 7-10 red
function aiDotColor(score) {
  if (score <= 3) return "#2e7d32";
  if (score <= 6) return "#f57f17";
  return "#c62828";
}

// column definitions used by the table
const COLUMNS = [
  { key: "aiRiskAvg", label: "⚡ AI" },
  { key: "oneInX", label: "🎯 Get In", fmt: (v) => v >= 999 ? "N/A" : `1:${v}` },
  { key: "startSalary", label: "🚀 Start", fmt: (v) => `$${v}K` },
  { key: "typicalPeak", label: "💰 Median", fmt: (v) => `$${v}K` },
  { key: "peakSalary", label: "🏆 Ceiling", fmt: (v) => `$${v}K` },
  { key: "satisfaction", label: "😊 Happy", fmt: (v) => `${v}%` },
  { key: "hoursWeek", label: "⏰ Hrs", fmt: (v) => `${v}` },
  { key: "burnout", label: "🔥 Burn", fmt: (v) => `${v}%` },
];

export default function FullField({ allTracks, profColors, profLabels }) {
  const [sortKey, setSortKey] = useState("typicalPeak");
  const [sortDir, setSortDir] = useState("desc");
  const [filterProf, setFilterProf] = useState("ALL");
  const [view, setView] = useState("table"); // "table" or "scatter"

  // toggle sort direction, or pick a new sort column
  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      // for "bad = high" columns default to ascending
      setSortDir(key === "hoursWeek" || key === "burnout" || key === "oneInX" || key === "aiRiskAvg" ? "asc" : "desc");
    }
  };

  // sorted + filtered list for the table
  const sorted = useMemo(() => {
    let data = [...allTracks];
    if (filterProf !== "ALL") data = data.filter((d) => d.profession === filterProf);
    data.sort((a, b) => {
      const av = a[sortKey] || (sortKey === "typicalPeak" ? a.peakSalary : 0) || 0;
      const bv = b[sortKey] || (sortKey === "typicalPeak" ? b.peakSalary : 0) || 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return data;
  }, [allTracks, sortKey, sortDir, filterProf]);

  // filtered list for the scatter plot (no sorting needed)
  const scatterData = useMemo(
    () =>
      allTracks.filter((d) => filterProf === "ALL" || d.profession === filterProf),
    [allTracks, filterProf]
  );

  return (
    <div style={{ padding: "12px 4px" }}>
      <h2 style={styles.header}>🏟️ The Full Field — All {allTracks.length} Careers</h2>
      <p style={styles.subtitle}>Every career we evaluated across {Object.keys(profColors).length} profession types</p>

      {/* profession filter buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        {["ALL", ...Object.keys(profColors)].map((p) => (
          <button
            key={p}
            onClick={() => setFilterProf(p)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              padding: "5px 12px",
              borderRadius: 20,
              cursor: "pointer",
              border: `2px solid ${p === "ALL" ? "#555" : profColors[p]}`,
              background:
                filterProf === p
                  ? p === "ALL"
                    ? "#555"
                    : profColors[p]
                  : "white",
              color:
                filterProf === p
                  ? "white"
                  : p === "ALL"
                  ? "#555"
                  : profColors[p],
              fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            {p === "ALL"
              ? `All ${allTracks.length}`
              : `${profLabels[p]} (${allTracks.filter((t) => t.profession === p).length})`}
          </button>
        ))}
      </div>

      {/* table / scatter toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          marginBottom: 12,
        }}
      >
        {[
          ["table", "📋 Table"],
          ["scatter", "📊 Plot"],
        ].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              padding: "4px 14px",
              borderRadius: 16,
              cursor: "pointer",
              border: "1px solid #ddd",
              background: view === v ? "#1a1a2e" : "white",
              color: view === v ? "white" : "#666",
              fontWeight: view === v ? 700 : 400,
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ── scatter plot view ── */}
      {view === "scatter" ? (
        <div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "#888",
              textAlign: "center",
              margin: "0 0 4px",
            }}
          >
            Typical Peak Pay vs Happiness — bigger dot = easier to get into
          </p>

          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                type="number"
                dataKey="satisfaction"
                name="Satisfaction"
                unit="%"
                tick={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}
                label={{
                  value: "😊 Happiness %",
                  position: "insideBottom",
                  offset: -10,
                  style: { fontSize: 11, fontFamily: "'DM Sans', sans-serif" },
                }}
                domain={[45, 95]}
              />
              <YAxis
                type="number"
                dataKey="typicalPeak"
                name="Typical Peak"
                unit="K"
                tick={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}
                label={{
                  value: "💰 Typical Peak ($K)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { fontSize: 11, fontFamily: "'DM Sans', sans-serif" },
                }}
              />
              <ZAxis type="number" dataKey="matchComp" range={[30, 220]} />

              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 11,
                        background: "white",
                        padding: "8px 12px",
                        borderRadius: 8,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: profColors[d.profession],
                          marginBottom: 2,
                        }}
                      >
                        {d.name}
                      </div>
                      <div style={{ color: "#888", fontSize: 10, marginBottom: 4 }}>
                        {profLabels[d.profession]}
                      </div>
                      <div>
                        Typical: <b>${d.typicalPeak}K</b>
                        {d.peakSalary > d.typicalPeak && (
                          <span style={{ color: "#aaa" }}> · ceiling ${d.peakSalary}K</span>
                        )}
                      </div>
                      <div>
                        Happy: <b>{d.satisfaction}%</b>
                      </div>
                      <div>
                        Get in: <b>1 in {d.oneInX}</b>
                      </div>
                      <div>
                        Hours: <b>{d.hoursWeek}/wk</b>
                      </div>
                    </div>
                  );
                }}
              />

              <Scatter data={scatterData}>
                {scatterData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={profColors[d.profession]}
                    fillOpacity={0.7}
                    stroke="none"
                    strokeWidth={0}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>

          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              color: "#aaa",
              textAlign: "center",
            }}
          >
            dot color = profession type
          </div>
        </div>
      ) : (
        /* ── table view ── */
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "separate",
              borderSpacing: "0 2px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              minWidth: 620,
            }}
          >
            <colgroup>
              <col style={{ width: "18%" }} />
              <col style={{ width: "9%" }} />
              {COLUMNS.map((col) => (
                <col key={col.key} style={{ width: col.key === "aiRiskAvg" ? "6%" : `${67 / (COLUMNS.length - 1)}%` }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "5px 3px",
                    fontSize: 9,
                    color: "#888",
                    background: "#fafaf8",
                  }}
                >
                  # Career
                </th>
                <th
                  style={{
                    padding: "3px",
                    fontSize: 9,
                    color: "#888",
                  }}
                >
                  Type
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    title={col.key === "aiRiskAvg" ? "AI risk: Now · 5yr · 10yr" : undefined}
                    style={{
                      padding: "5px 2px",
                      fontSize: 9,
                      color: sortKey === col.key ? "#D4A537" : "#888",
                      cursor: "pointer",
                      userSelect: "none",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {col.label}{" "}
                    {sortKey === col.key ? (sortDir === "desc" ? "▼" : "▲") : ""}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sorted.map((t, i) => {
                const bg = i % 2 === 0 ? "white" : "#fafafa";

                return (
                  <tr key={t.name} style={{ background: bg }}>
                    {/* sticky career name column */}
                    <td
                      title={t.name}
                      style={{
                        padding: "5px 3px",
                        fontWeight: 600,
                        background: bg,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        borderLeft: `3px solid ${profColors[t.profession]}`,
                      }}
                    >
                      <span style={{ color: "#bbb", fontSize: 10, marginRight: 4 }}>
                        {i + 1}
                      </span>
                      {t.name}
                    </td>

                    {/* profession badge */}
                    <td style={{ padding: "4px", overflow: "hidden" }}>
                      <div
                        title={t.profession}
                        style={{
                          fontSize: 9,
                          padding: "2px 4px",
                          borderRadius: 8,
                          background: `${profColors[t.profession]}18`,
                          color: profColors[t.profession],
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textAlign: "center",
                        }}
                      >
                        {t.profession}
                      </div>
                    </td>

                    {/* data columns with color-coding */}
                    {COLUMNS.map((col) => {
                      // AI risk column: render 3 colored dots
                      if (col.key === "aiRiskAvg") {
                        const now = t.aiRiskNow || 5;
                        const med = t.aiRiskMedium || 5;
                        const lng = t.aiRiskLong || 5;
                        return (
                          <td
                            key={col.key}
                            title={`Now: ${now} · 5yr: ${med} · 10yr: ${lng}`}
                            style={{
                              padding: "5px 2px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                              }}
                            >
                              {[now, med, lng].map((s, j) => (
                                <span
                                  key={j}
                                  style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: aiDotColor(s),
                                    flexShrink: 0,
                                  }}
                                />
                              ))}
                            </div>
                          </td>
                        );
                      }

                      const val = t[col.key];

                      // figure out the min/max for this column within the
                      // currently filtered set so colors stay relative
                      const pool =
                        filterProf === "ALL"
                          ? allTracks
                          : allTracks.filter((x) => x.profession === filterProf);
                      const allVals = pool.map((x) => x[col.key]);
                      const max = Math.max(...allVals);
                      const min = Math.min(...allVals);

                      // for hours & burnout, lower is better
                      const inverted =
                        col.key === "hoursWeek" || col.key === "burnout" || col.key === "oneInX";
                      const isGood = inverted
                        ? val <= min + (max - min) * 0.25
                        : val >= max - (max - min) * 0.25;
                      const isBad = inverted
                        ? val >= max - (max - min) * 0.25
                        : val <= min + (max - min) * 0.25;

                      return (
                        <td
                          key={col.key}
                          style={{
                            padding: "5px 2px",
                            textAlign: "center",
                            fontWeight: 600,
                            color: isGood
                              ? "#2e7d32"
                              : isBad
                              ? "#c62828"
                              : "#555",
                          }}
                        >
                          {col.fmt(val, t)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* legend for AI dots */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          color: "#999",
          textAlign: "center",
          marginTop: 6,
        }}
      >
        ⚡ AI column: 3 dots = Now · 5yr · 10yr risk —{" "}
        <span style={{ color: "#2e7d32" }}>●</span> low{" "}
        <span style={{ color: "#f57f17" }}>●</span> moderate{" "}
        <span style={{ color: "#c62828" }}>●</span> high
      </div>

      {/* takeaway box */}
      <div style={styles.soWhat}>
        💡 <strong>So What?</strong> {allTracks.length} careers across{" "}
        {Object.keys(profColors).length} professions — all scored on 107 data points.
        Tap column headers to re-sort!
      </div>
    </div>
  );
}
