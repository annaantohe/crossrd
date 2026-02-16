// FullField.jsx — "All 42" table + scatter plot with toggle
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

// column definitions used by the table
const COLUMNS = [
  { key: "peakSalary", label: "💰 Peak Pay", fmt: (v) => `$${v}K` },
  { key: "startSalary", label: "🚀 Start Pay", fmt: (v) => `$${v}K` },
  { key: "satisfaction", label: "😊 Happy", fmt: (v) => `${v}%` },
  { key: "hoursWeek", label: "⏰ Hrs/Wk", fmt: (v) => `${v}` },
  { key: "burnout", label: "🔥 Burnout", fmt: (v) => `${v}%` },
  { key: "matchComp", label: "🎯 Get In", fmt: (v) => `${v}/10` },
];

export default function FullField({ allTracks, profColors, profLabels }) {
  const [sortKey, setSortKey] = useState("peakSalary");
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
      setSortDir(key === "hoursWeek" || key === "burnout" ? "asc" : "desc");
    }
  };

  // sorted + filtered list for the table
  const sorted = useMemo(() => {
    let data = [...allTracks];
    if (filterProf !== "ALL") data = data.filter((d) => d.profession === filterProf);
    data.sort((a, b) =>
      sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]
    );
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
      <p style={styles.subtitle}>Every career we evaluated across {Object.keys(profColors).length} doctor types</p>

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
            Peak Pay vs Happiness — bigger dot = easier to get into
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
                dataKey="peakSalary"
                name="Peak Pay"
                unit="K"
                tick={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}
                label={{
                  value: "💰 Peak Pay ($K)",
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
                        Peak: <b>${d.peakSalary}K/yr</b>
                      </div>
                      <div>
                        Happy: <b>{d.satisfaction}%</b>
                      </div>
                      <div>
                        Get in: <b>{d.matchComp}/10</b>
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
                    fillOpacity={d.finalist ? 1 : 0.55}
                    stroke={d.finalist ? "#1a1a2e" : "none"}
                    strokeWidth={d.finalist ? 2 : 0}
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
            ⬤ with dark border = finalist (made top 6)
          </div>
        </div>
      ) : (
        /* ── table view ── */
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 2px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              minWidth: 600,
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
                    position: "sticky",
                    left: 0,
                    background: "#fafaf8",
                    zIndex: 2,
                    minWidth: 110,
                  }}
                >
                  # Career
                </th>
                <th
                  style={{
                    padding: "4px",
                    fontSize: 10,
                    color: "#888",
                    minWidth: 48,
                  }}
                >
                  Type
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    style={{
                      padding: "6px 4px",
                      fontSize: 10,
                      color: sortKey === col.key ? "#D4A537" : "#888",
                      cursor: "pointer",
                      userSelect: "none",
                      textAlign: "center",
                      minWidth: 60,
                      whiteSpace: "nowrap",
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
                const bg = t.finalist
                  ? "#fffde7"
                  : i % 2 === 0
                  ? "white"
                  : "#fafafa";

                return (
                  <tr key={t.name} style={{ background: bg }}>
                    {/* sticky career name column */}
                    <td
                      style={{
                        padding: "7px 4px",
                        fontWeight: 600,
                        position: "sticky",
                        left: 0,
                        background: bg,
                        zIndex: 1,
                        whiteSpace: "nowrap",
                        borderLeft: `3px solid ${profColors[t.profession]}`,
                      }}
                    >
                      <span style={{ color: "#bbb", fontSize: 10, marginRight: 4 }}>
                        {i + 1}
                      </span>
                      {t.name}
                      {t.finalist ? " ⭐" : ""}
                    </td>

                    {/* profession badge */}
                    <td style={{ padding: "4px", textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "2px 6px",
                          borderRadius: 8,
                          background: `${profColors[t.profession]}18`,
                          color: profColors[t.profession],
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.profession}
                      </span>
                    </td>

                    {/* data columns with color-coding */}
                    {COLUMNS.map((col) => {
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
                        col.key === "hoursWeek" || col.key === "burnout";
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
                            padding: "7px 4px",
                            textAlign: "center",
                            fontWeight: 600,
                            color: isGood
                              ? "#2e7d32"
                              : isBad
                              ? "#c62828"
                              : "#555",
                          }}
                        >
                          {col.fmt(val)}
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

      {/* takeaway box */}
      <div style={styles.soWhat}>
        💡 <strong>So What?</strong> Of {allTracks.length} careers across{" "}
        {Object.keys(profColors).length} professions,{" "}
        {allTracks.filter((t) => t.finalist).length} made the finals (⭐). Tap
        column headers to re-sort!
      </div>
    </div>
  );
}
