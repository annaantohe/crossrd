// EducationPath.jsx — Education years comparison across careers
// Sorted horizontal bars showing how long each path takes before earning.

import { styles } from "../styles/theme";

const BLOCKS = {
  college: { color: "#42A5F5", label: "College" },
  school: { color: "#FF9800", label: "Grad School" },
  residency: { color: "#EF5350", label: "Training" },
  fellowship: { color: "#AB47BC", label: "Extra Training" },
};

const MIN_AGE = 18;
const MAX_AGE = 36;
const TOTAL = MAX_AGE - MIN_AGE;

export default function EducationPath({ timelineData, careers }) {
  if (!timelineData.length) return null;

  // sort by total education years (longest first)
  const sorted = [...timelineData].sort((a, b) => b.earnAge - a.earnAge);
  const longest = sorted[0];
  const shortest = sorted[sorted.length - 1];
  const yearDiff = longest.earnAge - shortest.earnAge;

  return (
    <div style={{ padding: "12px 8px" }}>
      <h2 style={styles.header}>Education Path</h2>
      <p style={styles.subtitle}>
        How long before you start earning real money?
      </p>

      {/* headline stat */}
      {yearDiff > 0 && (
        <div
          style={{
            textAlign: "center",
            margin: "0 auto 16px",
            background: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
            borderRadius: 16,
            padding: "16px 20px",
            maxWidth: 320,
            border: "1px solid #ffcc80",
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 42,
              fontWeight: 800,
              color: "#e65100",
              lineHeight: 1,
            }}
          >
            {yearDiff}
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#bf360c",
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            year{yearDiff !== 1 ? "s" : ""} difference in training
          </div>
        </div>
      )}

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
          Earning!
        </span>
      </div>

      {/* sorted bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map((td) => {
          const career = careers.find((c) => c.key === td.key);
          const totalYears = td.earnAge - 18;

          return (
            <div
              key={td.key}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {/* career label with family icon */}
              <div
                style={{
                  width: 100,
                  flexShrink: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: career?.color || "#555",
                  textAlign: "right",
                  lineHeight: 1.2,
                }}
              >
                {career?.familyIcon && (
                  <span style={{ fontSize: 10, marginRight: 2 }}>
                    {career.familyIcon}
                  </span>
                )}
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
                {["college", "school", "residency", "fellowship"].map(
                  (phase) => {
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
                  }
                )}

                {/* earning phase */}
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

                {/* salary label */}
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
                  ${td.startSalary}K
                </div>
              </div>

              {/* years badge */}
              <div
                style={{
                  width: 36,
                  flexShrink: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#1a1a2e",
                  textAlign: "center",
                }}
              >
                {totalYears}y
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.soWhat}>
        💡 <strong>So What?</strong> Some careers pay more but require 2x the
        training. A lawyer earns real money at 25, while a surgeon doesn't until
        33+. Is the extra time worth it to you?
      </div>
    </div>
  );
}
