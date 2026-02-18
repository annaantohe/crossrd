// Compare.jsx — Comparison view with sub-tabs
// Cross-family: shows picks from ALL families merged together.
// Shows an empty state if fewer than 2 careers are picked.

import { useState } from "react";
import { styles } from "../styles/theme";
import RaceToMillion from "./RaceToMillion";
import Scorecard from "./Scorecard";
import Timeline from "./Timeline";
import RiskDashboard from "./RiskDashboard";
import MoneyScoreboard from "./MoneyScoreboard";
import EducationPath from "./EducationPath";

const SUB_TABS = [
  { id: "overview", label: "Overview" },
  { id: "education", label: "Education" },
  { id: "race", label: "Race" },
  { id: "scores", label: "Scores" },
  { id: "time", label: "Time" },
  { id: "risk", label: "Risk" },
];

export default function Compare({
  picks,
  allCareers,
  onTogglePick,
  profColors,
  profLabels,
  netWorthData,
  radarData,
  stressData,
  moneyData,
  timelineData,
  selectedCareers,
}) {
  const [subTab, setSubTab] = useState("overview");
  const [editing, setEditing] = useState(false);

  // how many fields are represented
  const familyCount = new Set(selectedCareers.map((c) => c.family).filter(Boolean)).size;

  if (picks.length < 2) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22,
            fontWeight: 800,
            color: "#1a1a2e",
            marginBottom: 8,
          }}
        >
          Pick at least 2 careers
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "#888",
            lineHeight: 1.5,
          }}
        >
          Head to the Explore tab and tap "+ Pick" on careers you're interested in.
          <br />
          Pick from different fields to compare across healthcare and law!
        </div>
      </div>
    );
  }

  // group careers by family for the editor
  const renderEditor = () => {
    if (!editing) return null;
    const byFamily = {};
    for (const c of allCareers) {
      const fam = c.family || "other";
      if (!byFamily[fam]) byFamily[fam] = [];
      byFamily[fam].push(c);
    }
    return (
      <div
        style={{
          background: "#f8f8f6",
          borderRadius: 12,
          padding: "10px 12px",
          margin: "0 8px 12px",
          maxHeight: 300,
          overflowY: "auto",
        }}
      >
        {Object.entries(byFamily).map(([fam, careers]) => (
          <div key={fam}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#888",
                margin: "8px 4px 4px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {careers[0]?.familyIcon || ""} {careers[0]?.familyName || fam}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {careers.map((c) => {
                const picked = picks.includes(c.key);
                return (
                  <button
                    key={c.key}
                    onClick={() => onTogglePick(c.key)}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: 8,
                      border: picked ? `1px solid ${c.color}` : "1px solid #ddd",
                      background: picked ? `${c.color}18` : "white",
                      color: picked ? c.color : "#888",
                      cursor: "pointer",
                      fontWeight: picked ? 700 : 400,
                    }}
                  >
                    {picked ? "✓ " : ""}
                    {c.name.length > 18 ? c.name.slice(0, 16) + "…" : c.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const selectorProps = {
    allCareers,
    selectedKeys: picks,
    onChange: () => {},
    profColors,
    profLabels,
  };

  return (
    <div style={{ padding: "4px 0 80px" }}>
      <h2 style={{ ...styles.header, marginBottom: 2 }}>Compare</h2>
      <p style={styles.subtitle}>
        {picks.length} careers
        {familyCount > 1 ? ` across ${familyCount} fields` : " selected"}
      </p>

      {/* edit picks button */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <button
          onClick={() => setEditing(!editing)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            padding: "4px 12px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: editing ? "#1a1a2e" : "white",
            color: editing ? "white" : "#888",
            cursor: "pointer",
          }}
        >
          {editing ? "Done editing" : "Edit Picks ▼"}
        </button>
      </div>
      {renderEditor()}

      {/* sub-tab bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          margin: "0 8px 12px",
          background: "#f0f0ee",
          borderRadius: 10,
          padding: 3,
          overflowX: "auto",
        }}
      >
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              padding: "6px 10px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: subTab === t.id ? "white" : "transparent",
              color: subTab === t.id ? "#1a1a2e" : "#888",
              fontWeight: subTab === t.id ? 700 : 500,
              boxShadow: subTab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* sub-tab content */}
      {subTab === "overview" && (
        <div>
          <Scorecard radarDimensions={radarData} careers={selectedCareers} selectorProps={selectorProps} />
          <MoneyScoreboard moneyData={moneyData} careers={selectedCareers} selectorProps={selectorProps} />
        </div>
      )}
      {subTab === "education" && (
        <EducationPath timelineData={timelineData} careers={selectedCareers} />
      )}
      {subTab === "race" && (
        <RaceToMillion netWorthData={netWorthData} careers={selectedCareers} selectorProps={selectorProps} />
      )}
      {subTab === "scores" && (
        <Scorecard radarDimensions={radarData} careers={selectedCareers} selectorProps={selectorProps} />
      )}
      {subTab === "time" && (
        <Timeline timelineData={timelineData} careers={selectedCareers} selectorProps={selectorProps} />
      )}
      {subTab === "risk" && (
        <RiskDashboard stressData={stressData} careers={selectedCareers} selectorProps={selectorProps} />
      )}
    </div>
  );
}
