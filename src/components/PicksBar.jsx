// PicksBar.jsx — Floating bottom bar showing the user's picked careers
// Shows colored chips with × to remove, and a "Compare →" button.

const MAX_PICKS = 6;

export default function PicksBar({ picks, allCareers, onTogglePick, onCompare }) {
  const pickedCareers = picks
    .map((key) => allCareers.find((c) => c.key === key))
    .filter(Boolean);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: "white",
        borderTop: "1px solid #e0e0e0",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        maxWidth: 680,
        margin: "0 auto",
      }}
    >
      {picks.length === 0 ? (
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#aaa",
            flex: 1,
            textAlign: "center",
          }}
        >
          ⭐ Pick careers to compare
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: 4,
              flex: 1,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {pickedCareers.map((c) => (
              <span
                key={c.key}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 10,
                  background: `${c.color}18`,
                  color: c.color,
                  border: `1px solid ${c.color}40`,
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  flexShrink: 0,
                }}
              >
                {c.name.length > 14 ? c.name.slice(0, 12) + "…" : c.name}
                <span
                  onClick={() => onTogglePick(c.key)}
                  style={{ cursor: "pointer", opacity: 0.6, fontSize: 10 }}
                >
                  ×
                </span>
              </span>
            ))}
          </div>

          {picks.length >= 2 && (
            <button
              onClick={onCompare}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                padding: "6px 12px",
                borderRadius: 10,
                border: "none",
                background: "#D4A537",
                color: "white",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Compare →
            </button>
          )}
        </>
      )}

      {/* pick count */}
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          color: "#bbb",
          flexShrink: 0,
        }}
      >
        {picks.length}/{MAX_PICKS}
      </span>
    </div>
  );
}
