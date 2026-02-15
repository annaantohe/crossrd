// design system — colors, fonts, and shared styles for crossrd

// finalist career colors
export const CAREER_COLORS = {
  mohs: "#D4A537",
  derm: "#E8685E",
  eye: "#2BA5B5",
  pod: "#2D3A6E",
  sport: "#3EA66B",
  wound: "#8B6CAE",
};

// finalist career info
export const CAREERS = [
  { key: "mohs", name: "Skin Cancer Surgeon", color: "#D4A537", path: "Medical Doctor" },
  { key: "derm", name: "Skin Doctor", color: "#E8685E", path: "Medical Doctor" },
  { key: "eye", name: "Eye Surgeon", color: "#2BA5B5", path: "Medical Doctor" },
  { key: "pod", name: "Foot & Ankle Surgeon", color: "#2D3A6E", path: "Foot Doctor" },
  { key: "sport", name: "Sports Foot Doctor", color: "#3EA66B", path: "Foot Doctor" },
  { key: "wound", name: "Wound Healing Doctor", color: "#8B6CAE", path: "Foot Doctor" },
];

// profession colors (for the all-42 view)
export const PROF_COLORS = {
  "MD/DO": "#E55934",
  "DDS/DMD": "#1982C4",
  "DPM": "#8AC926",
  "OD": "#6A4C93",
};

// profession labels (teen-friendly names)
export const PROF_LABELS = {
  "MD/DO": "Medical Doctor",
  "DDS/DMD": "Dentist",
  "DPM": "Foot Doctor",
  "OD": "Eye Doctor (Optom.)",
};

// tab definitions
export const TABS = [
  { id: "home", label: "🏠 Home" },
  { id: "field", label: "🏟️ All 42" },
  { id: "race", label: "🏁 Race" },
  { id: "scorecard", label: "⭐ Scores" },
  { id: "timeline", label: "⏳ Time" },
  { id: "risk", label: "⚠️ Risk" },
  { id: "money", label: "💰 Money" },
  { id: "tree", label: "🌳 Answer" },
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
