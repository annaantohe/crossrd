// TabNav.jsx — Sticky horizontal tab bar
// Scrollable on mobile, highlights the active tab.

import { TABS } from "../styles/theme";

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        overflowX: "auto",
        gap: 2,
        padding: "8px 4px 0",
        background: "white",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        zIndex: 10,
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onTabChange(t.id)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            padding: "8px 10px 10px",
            whiteSpace: "nowrap",
            border: "none",
            cursor: "pointer",
            borderRadius: "8px 8px 0 0",
            transition: "all 0.2s",
            background: activeTab === t.id ? "#1a1a2e" : "transparent",
            color: activeTab === t.id ? "white" : "#888",
            fontWeight: activeTab === t.id ? 700 : 500,
          }}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
