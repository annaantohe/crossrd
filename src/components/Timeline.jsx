// Timeline.jsx — Training duration horizontal bars
// Shows each finalist's journey from college to first real paycheck.

import { styles } from "../styles/theme";

// color key for each training phase
const BLOCKS = {
  college: { color: "#42A5F5", label: "College" },
  school: { color: "#FF9800", label: "Med/Pod School" },
  residency: { color: "#EF5350", label: "Training" },
  fellowship: { color: "#AB47BC", label: "Extra Training" },
};

// age range the bars span
const MIN_AGE = 18;
const MAX_AGE = 35;
const TOTAL = MAX_AGE - MIN_AGE;

export default function Timeline({ timelineData, careers }) {
  return (
    <div style={{ padding: "12px 8px" }}>
      <h2 style={styles.header}>⏳ How Long Does It Take?</h2>
      <p style={styles.subtitle}>From college to your first real paycheck</p>

      {/* legend */}
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        {Object.entries(BLOCKS).map(([k, v]) => (
          <span
            key={k}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: v.color,
                display: "inline-block",
              }}
            />
            {v.label}
          </span>
        ))}
        {/* earning phase */}
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: "#66BB6A",
              display: "inline-block",
            }}
          />
          💰 Earning!
        </span>
      </div>

      {/* bars — one row per finalist career */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {timelineData.map((td) => {
          const career = careers.find((c) => c.key === td.key);

          return (
            <div key={td.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* career label */}
              <div
                style={{
                  width: 90,
                  flexShrink: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: career?.color || "#555",
                  textAlign: "right",
                  lineHeight: 1.2,
                }}
              >
                {career?.name || td.key}
              </div>

              {/* bar track */}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: 32,
                  background: "#f5f5f5",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                {/* training phase blocks */}
                {["college", "school", "residency", "fellowship"].map((phase) => {
                  if (!td[phase]) return null;
                  const [start, end] = td[phase];
                  return (
                    <div
                      key={phase}
                      style={{
                        position: "absolute",
                        top: 2,
                        bottom: 2,
                        borderRadius: 4,
                        left: `${((start - MIN_AGE) / TOTAL) * 100}%`,
                        width: `${((end - start) / TOTAL) * 100}%`,
                        background: BLOCKS[phase].color,
                        opacity: 0.85,
                      }}
                    />
                  );
                })}

                {/* earning phase (green, goes to end) */}
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    bottom: 2,
                    borderRadius: 4,
                    left: `${((td.earnAge - MIN_AGE) / TOTAL) * 100}%`,
                    right: 0,
                    background: "#66BB6A",
                    opacity: 0.85,
                  }}
                />

                {/* salary label inside the green bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "'DM Sans', sans-serif",
                    left: `${((td.earnAge - MIN_AGE) / TOTAL) * 100 + 1}%`,
                    fontSize: 10,
                    fontWeight: 700,
                    color: "white",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Age {td.earnAge} → ${td.startSalary}K/yr
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.soWhat}>
        💡 <strong>So What?</strong> Foot Doctor paths start earning at 29. Medical
        Doctor paths take until 30–31. But the starting salary is up to $450K vs
        $160–220K!
      </div>
    </div>
  );
}
