// DecisionTree.jsx — Interactive decision tree + final ranking table
// Walks the user through a few questions to find their best-fit career,
// then shows the official final ranking underneath.

import { useState } from "react";
import { styles } from "../styles/theme";

// rank emojis for the final table (positions 1-3 get medals)
const RANK_EMOJI = { 1: "🥇", 2: "🥈", 3: "🥉" };

function buildTree(raw, results) {
  return {
    q: raw.q,
    emoji: "❓",
    yes: {
      q: raw.yes.q,
      emoji: "📚",
      yes: {
        q: raw.yes.yes.q,
        emoji: "🔬",
        yes: { result: raw.yes.yes.procedural, ...results[raw.yes.yes.procedural] },
        no: { result: raw.yes.yes.variety, ...results[raw.yes.yes.variety] },
      },
      no: { result: raw.yes.no, ...results[raw.yes.no] },
    },
    no: {
      q: raw.no.q,
      emoji: "🎯",
      options: raw.no.options.map((opt) => ({
        label: opt.label,
        result: opt.result,
        ...results[opt.result],
      })),
    },
  };
}

export default function DecisionTree({ decisionTree, decisionTreeResults, ranking, allCareers, picks = [], onTogglePick }) {
  const tree = buildTree(decisionTree, decisionTreeResults);

  const [path, setPath] = useState([]);

  const navigate = (choice) => setPath((prev) => [...prev, choice]);
  const reset = () => setPath([]);

  // walk the tree to find the current node
  let current = tree;
  for (const step of path) {
    if (typeof step === "number") {
      current = current.options[step];
    } else {
      current = current[step];
    }
  }

  const isResult = current?.result != null;
  const rc = isResult ? allCareers.find((c) => c.key === current.result) : null;

  const btnStyle = (color) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    padding: "12px 20px",
    borderRadius: 12,
    border: `2px solid ${color}`,
    background: "white",
    cursor: "pointer",
    color,
    transition: "all 0.2s",
  });

  return (
    <div style={{ padding: "12px 8px" }}>
      <h2 style={styles.header}>The Final Answer</h2>
      <p style={styles.subtitle}>Answer a few questions to find your best career</p>

      {/* progress dots */}
      <div
        style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 32,
              height: 4,
              borderRadius: 2,
              background:
                i < path.length
                  ? "#D4A537"
                  : i === path.length && !isResult
                  ? "#ddd"
                  : "#eee",
            }}
          />
        ))}
      </div>

      {/* question card */}
      {!isResult ? (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "28px 20px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            maxWidth: 420,
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>{current.emoji}</div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#1a1a2e",
              lineHeight: 1.4,
              margin: "0 0 20px",
            }}
          >
            {current.q}
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxWidth: 280,
              margin: "0 auto",
            }}
          >
            {current.options ? (
              current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => navigate(i)}
                  style={btnStyle(
                    i === 0 ? "#2e7d32" : i === 1 ? "#1565c0" : "#6a1b9a"
                  )}
                >
                  {opt.label}
                </button>
              ))
            ) : (
              <>
                <button onClick={() => navigate("yes")} style={btnStyle("#2e7d32")}>
                  Yes!
                </button>
                <button onClick={() => navigate("no")} style={btnStyle("#c62828")}>
                  Nope
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* result card */
        <div
          style={{
            background: `linear-gradient(135deg, ${rc.color}15, ${rc.color}08)`,
            borderRadius: 20,
            padding: "28px 20px",
            textAlign: "center",
            border: `2px solid ${rc.color}30`,
            maxWidth: 420,
            margin: "0 auto",
            boxShadow: `0 8px 32px ${rc.color}20`,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 28,
              fontWeight: 800,
              color: rc.color,
              marginBottom: 4,
            }}
          >
            {rc.name}
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#555",
              marginBottom: 12,
              fontStyle: "italic",
            }}
          >
            {current.tagline}
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#1a1a2e",
              background: "white",
              borderRadius: 10,
              padding: "10px 16px",
              display: "inline-block",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {current.stat}
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "#888",
            }}
          >
            via the {rc.path} path
          </div>
          {onTogglePick && (
            <button
              onClick={() => onTogglePick(current.result)}
              style={{
                marginTop: 12,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                padding: "8px 20px",
                borderRadius: 12,
                border: picks.includes(current.result)
                  ? `2px solid ${rc.color}`
                  : "2px solid #D4A537",
                background: picks.includes(current.result) ? rc.color : "#D4A537",
                color: "white",
                cursor: "pointer",
              }}
            >
              {picks.includes(current.result) ? "Picked!" : "⭐ Add to My Picks"}
            </button>
          )}
        </div>
      )}

      {/* start over button */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          onClick={reset}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            padding: "8px 20px",
            borderRadius: 20,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
            color: "#666",
          }}
        >
          Start Over
        </button>
      </div>

      {/* final ranking table */}
      <div
        style={{
          marginTop: 24,
          padding: "16px 12px",
          background: "#fafafa",
          borderRadius: 12,
        }}
      >
        <h3
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#555",
            textAlign: "center",
            margin: "0 0 10px",
          }}
        >
          Official Final Ranking
        </h3>

        {ranking.map((r) => {
          const career = allCareers.find((x) => x.key === r.key);
          return (
            <div
              key={r.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderBottom: "1px solid #eee",
              }}
            >
              <span
                style={{ fontSize: 16, width: 28, textAlign: "center", flexShrink: 0 }}
              >
                {RANK_EMOJI[r.rank] || String(r.rank)}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: career?.color || "#555",
                  width: 120,
                  flexShrink: 0,
                }}
              >
                {career?.name || r.track}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: "#888",
                }}
              >
                {r.note}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
