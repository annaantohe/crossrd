// App.jsx — Main app shell
// Loads healthcare data from JSON once, then passes slices to each tab view.

import { useState } from "react";
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

// flatten each track's raw_data into the top level so components
// can access t.peakSalary instead of t.raw_data.peakSalary
const allTracks = healthcareData.tracks.map((t) => ({
  name: t.name,
  profession: t.profession,
  finalist: t.finalist,
  ...t.raw_data,
}));

// pull out the finalist-specific datasets
const { finalists } = healthcareData;

export default function App() {
  const [tab, setTab] = useState("home");

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
            meta={healthcareData.meta}
            professions={healthcareData.professions}
            allTracks={allTracks}
          />
        )}
        {tab === "field" && <FullField allTracks={allTracks} />}
        {tab === "race" && (
          <RaceToMillion netWorthData={finalists.net_worth_trajectory} />
        )}
        {tab === "scorecard" && (
          <Scorecard radarDimensions={finalists.radar_dimensions} />
        )}
        {tab === "timeline" && (
          <Timeline timelineData={finalists.timeline_data} />
        )}
        {tab === "risk" && (
          <RiskDashboard stressTest={finalists.stress_test} />
        )}
        {tab === "money" && (
          <MoneyScoreboard moneyData={finalists.money_data} />
        )}
        {tab === "tree" && (
          <DecisionTree
            decisionTree={finalists.decision_tree}
            ranking={finalists.ranking}
          />
        )}
      </div>
    </div>
  );
}
