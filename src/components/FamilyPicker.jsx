// FamilyPicker.jsx — Landing page: pick a profession family
// Shows crossrd branding + clickable cards for each available family.

export default function FamilyPicker({ families, onSelect, onCompare }) {
  const available = Object.entries(families);

  // count total picks across all families from localStorage
  let totalPicks = 0;
  const pickSummary = [];
  for (const [slug, fd] of available) {
    try {
      const saved = localStorage.getItem(`crossrd-picks-${slug}`);
      if (saved) {
        const count = JSON.parse(saved).length;
        if (count > 0) {
          totalPicks += count;
          pickSummary.push(`${fd.meta.icon} ${count}`);
        }
      }
    } catch {}
  }

  // future families (greyed-out teasers)
  const comingSoon = [];

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 16px 80px",
        maxWidth: 680,
        margin: "0 auto",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* crossrd brand */}
      <div
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(44px, 11vw, 72px)",
          fontWeight: 800,
          color: "#1a1a2e",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          margin: "0 0 6px",
        }}
      >
        cross<span style={{ color: "#D4A537" }}>rd</span>
        <sup style={{ fontSize: "0.3em", color: "#bbb", fontWeight: 400, verticalAlign: "super" }}>™</sup>
      </div>

      <h1
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(18px, 4.5vw, 26px)",
          fontWeight: 600,
          color: "#1a1a2e",
          lineHeight: 1.3,
          margin: "0 0 6px",
        }}
      >
        what should i actually be when i grow up?
      </h1>

      <p
        style={{
          fontSize: "clamp(13px, 3vw, 16px)",
          color: "#999",
          margin: "0 0 32px",
          fontStyle: "italic",
        }}
      >
        we overthought it so you don't have to
      </p>

      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#666",
          margin: "0 0 16px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        pick a field
      </p>

      {/* family cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          maxWidth: 400,
          margin: "0 auto 24px",
        }}
      >
        {available.map(([slug, data]) => (
          <button
            key={slug}
            onClick={() => onSelect(slug)}
            style={{
              background: "white",
              border: "2px solid #e8e8e8",
              borderRadius: 16,
              padding: "20px 12px",
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#D4A537";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e8e8e8";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>
              {data.meta.icon}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#1a1a2e",
                marginBottom: 4,
              }}
            >
              {data.meta.family_name}
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>
              {data.meta.total_tracks} careers · {Object.keys(data.groups).length} groups
            </div>
            {data.meta.note && (
              <div
                style={{
                  fontSize: 10,
                  color: "#D4A537",
                  fontStyle: "italic",
                  marginTop: 4,
                }}
              >
                emerging & imagined careers
              </div>
            )}
          </button>
        ))}

        {/* coming soon cards */}
        {comingSoon.map((f) => (
          <div
            key={f.slug}
            style={{
              background: "#f5f5f5",
              border: "2px dashed #ddd",
              borderRadius: 16,
              padding: "20px 12px",
              textAlign: "center",
              opacity: 0.5,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8, filter: "grayscale(100%)" }}>
              {f.icon}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#999",
                marginBottom: 4,
              }}
            >
              {f.name}
            </div>
            <div style={{ fontSize: 11, color: "#bbb" }}>coming soon</div>
          </div>
        ))}
      </div>

      {/* compare across fields */}
      {totalPicks >= 2 && onCompare && (
        <button
          onClick={onCompare}
          style={{
            display: "block",
            margin: "0 auto",
            padding: "14px 28px",
            borderRadius: 16,
            border: "2px solid #D4A537",
            background: "linear-gradient(135deg, #D4A537, #c4952e)",
            color: "white",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(212,165,55,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Compare across fields ({pickSummary.join(" + ")})
        </button>
      )}

      {/* footer */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 16,
          borderTop: "1px solid #eee",
          fontSize: 11,
          color: "#bbb",
        }}
      >
        © 2025 Anna Antohe · crossrd™
      </div>
    </div>
  );
}
