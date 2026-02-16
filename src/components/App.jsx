// App.jsx — Main app shell
// Loads data from JSON, derives theme info, and passes slices to each tab view.

import { useState, useMemo } from "react";
import healthcareData from "../data/healthcare.json";
import { TABS } from "../styles/theme";
import {
  buildNetWorthFromTracks,
  buildRadarFromTracks,
  buildStressFromTracks,
  buildMoneyFromTracks,
  buildTimelineFromTracks,
} from "../utils/deriveData";

import TabNav from "./TabNav";
import Home from "./Home";
import FullField from "./FullField";
import RaceToMillion from "./RaceToMillion";
import Scorecard from "./Scorecard";
import Timeline from "./Timeline";
import RiskDashboard from "./RiskDashboard";
import MoneyScoreboard from "./MoneyScoreboard";
import DecisionTree from "./DecisionTree";
import Sources from "./Sources";

// all available profession families (add new ones here when ready)
const FAMILIES = {
  healthcare: healthcareData,
  // engineering: engineeringData,  // future
};

// default careers to show in comparison tabs (top picks from original analysis)
const DEFAULT_KEYS = ["mohs", "derm", "eye", "pod", "sport", "wound"];

export default function App() {
  const [tab, setTab] = useState("home");
  const [selectedKeys, setSelectedKeys] = useState(() => {
    // use defaults that exist in the data
    const validKeys = new Set(FAMILIES.healthcare.careers.map((c) => c.key));
    return DEFAULT_KEYS.filter((k) => validKeys.has(k));
  });

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

  // all careers (key/name/color/path/profession) for the selector
  const allCareers = useMemo(
    () =>
      data.careers.map((c) => {
        const track = data.tracks.find((t) => t.key === c.key);
        return { ...c, profession: track?.profession || "" };
      }),
    [data]
  );

  // flatten each track's raw_data into the top level so components
  // can access t.peakSalary instead of t.raw_data.peakSalary
  const allTracks = useMemo(
    () =>
      data.tracks.map((t) => ({
        name: t.name,
        key: t.key,
        profession: t.profession,
        color: t.color,
        ...t.raw_data,
      })),
    [data]
  );

  // derive chart data from tracks for the selected careers
  const selectedCareers = useMemo(
    () => selectedKeys.map((k) => allCareers.find((c) => c.key === k)).filter(Boolean),
    [selectedKeys, allCareers]
  );

  const netWorthData = useMemo(
    () => buildNetWorthFromTracks(data.tracks, selectedKeys),
    [data.tracks, selectedKeys]
  );

  const radarData = useMemo(
    () => buildRadarFromTracks(data.tracks, selectedKeys),
    [data.tracks, selectedKeys]
  );

  const stressData = useMemo(
    () => buildStressFromTracks(data.tracks, selectedKeys),
    [data.tracks, selectedKeys]
  );

  const moneyData = useMemo(
    () => buildMoneyFromTracks(data.tracks, selectedKeys),
    [data.tracks, selectedKeys]
  );

  const timelineData = useMemo(
    () => buildTimelineFromTracks(data.tracks, selectedKeys),
    [data.tracks, selectedKeys]
  );

  // shared selector props
  const selectorProps = {
    allCareers,
    selectedKeys,
    onChange: setSelectedKeys,
    profColors,
    profLabels,
  };

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
            netWorthData={netWorthData}
            careers={selectedCareers}
            selectorProps={selectorProps}
          />
        )}
        {tab === "scorecard" && (
          <Scorecard
            radarDimensions={radarData}
            careers={selectedCareers}
            selectorProps={selectorProps}
          />
        )}
        {tab === "timeline" && (
          <Timeline
            timelineData={timelineData}
            careers={selectedCareers}
            selectorProps={selectorProps}
          />
        )}
        {tab === "risk" && (
          <RiskDashboard
            stressData={stressData}
            careers={selectedCareers}
            selectorProps={selectorProps}
          />
        )}
        {tab === "money" && (
          <MoneyScoreboard
            moneyData={moneyData}
            careers={selectedCareers}
            selectorProps={selectorProps}
          />
        )}
        {tab === "tree" && (
          <DecisionTree
            decisionTree={data.decision_tree}
            decisionTreeResults={data.decision_tree_results}
            ranking={data.ranking}
            allCareers={allCareers}
          />
        )}
        {tab === "sources" && <Sources />}
      </div>
    </div>
  );
}
