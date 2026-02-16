// App.jsx — Main app shell
// Loads data from JSON, derives theme info, and passes slices to each tab view.

import { useState, useMemo } from "react";
import healthcareData from "../data/healthcare.json";
import { TABS } from "../styles/theme";

import TabNav from "./TabNav";
import Home from "./Home";
import FullField from "./FullField";
import RaceToMillion from "./RaceToMillion";
import Scorecard from "./Scorecard";
import Timeline from "./Timeline";
import RiskDashboard from "./RiskDashboard";
import MoneyScoreboard from "./MoneyScoreboard";
import DecisionTree from "./DecisionTree";

// all available profession families (add new ones here when ready)
const FAMILIES = {
  healthcare: healthcareData,
  // engineering: engineeringData,  // future
};

export default function App() {
  const [tab, setTab] = useState("home");

  // for now just healthcare — when we have multiple families,
  // this will come from a selector + localStorage
  const data = FAMILIES.healthcare;

  // derive profession colors and labels from JSON data
  const profColors = useMemo(() => {
    const colors = {};
    Object.entries(data.professions).forEach(([key, val]) => {
      colors[key] = val.color;
    });
    return colors;
  }, [data]);

  const profLabels = useMemo(() => {
    const labels = {};
    Object.entries(data.professions).forEach(([key, val]) => {
      labels[key] = val.label;
    });
    return labels;
  }, [data]);

  // careers array comes from JSON (replaces old hardcoded CAREERS in theme.js)
  const careers = data.careers;

  // flatten each track's raw_data into the top level so components
  // can access t.peakSalary instead of t.raw_data.peakSalary
  const allTracks = useMemo(
    () =>
      data.tracks.map((t) => ({
        name: t.name,
        profession: t.profession,
        finalist: t.finalist,
        ...t.raw_data,
      })),
    [data]
  );

  const { finalists } = data;

  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        background: "#fafaf8",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* sticky tab bar */}
      <TabNav activeTab={tab} onTabChange={setTab} />

      {/* page content — only the active tab renders */}
      <div style={{ padding: "0 0 24px" }}>
        {tab === "home" && (
          <Home
            meta={data.meta}
            professions={data.professions}
            profColors={profColors}
            profLabels={profLabels}
            allTracks={allTracks}
          />
        )}
        {tab === "field" && (
          <FullField
            allTracks={allTracks}
            profColors={profColors}
            profLabels={profLabels}
          />
        )}
        {tab === "race" && (
          <RaceToMillion
            netWorthData={finalists.net_worth_trajectory}
            careers={careers}
          />
        )}
        {tab === "scorecard" && (
          <Scorecard
            radarDimensions={finalists.radar_dimensions}
            careers={careers}
          />
        )}
        {tab === "timeline" && (
          <Timeline timelineData={finalists.timeline_data} careers={careers} />
        )}
        {tab === "risk" && (
          <RiskDashboard
            stressTest={finalists.stress_test}
            careers={careers}
          />
        )}
        {tab === "money" && (
          <MoneyScoreboard
            moneyData={finalists.money_data}
            careers={careers}
          />
        )}
        {tab === "tree" && (
          <DecisionTree
            decisionTree={finalists.decision_tree}
            decisionTreeResults={finalists.decision_tree_results}
            ranking={finalists.ranking}
            careers={careers}
          />
        )}
      </div>
    </div>
  );
}
