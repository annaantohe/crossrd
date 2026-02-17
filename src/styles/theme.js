// design system — fonts, shared styles, and utilities for crossrd
// career colors and profession data now come from the JSON, not here

// tab definitions
export const TABS = [
  { id: "explore", label: "🔍 Explore" },
  { id: "compare", label: "📊 Compare" },
  { id: "quiz", label: "🧭 Quiz" },
  { id: "sources", label: "📖 Sources" },
];

// shared text styles
export const styles = {
  header: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(22px, 5vw, 30px)",
    fontWeight: 800,
    color: "#1a1a2e",
    textAlign: "center",
    margin: "8px 0 4px",
  },
  subtitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    margin: "0 0 16px",
  },
  soWhat: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    lineHeight: 1.5,
    background: "linear-gradient(135deg, #fffde7, #fff8e1)",
    borderRadius: 12,
    padding: "12px 16px",
    margin: "16px 4px 0",
    color: "#555",
    border: "1px solid #fff176",
  },
};

// helper to format dollar amounts nicely
export const formatDollars = (v) =>
  Math.abs(v) >= 1000 ? `$${(v / 1000).toFixed(1)}M` : `$${v}K`;
