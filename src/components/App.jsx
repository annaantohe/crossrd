// App.jsx — Main app shell
// 4 tabs: Explore, Compare, Quiz, Sources
// Manages picks state (persisted in localStorage) and derives chart data.

import { useState, useEffect, useMemo } from "react";
import healthcareData from "../data/healthcare.json";
import {
  buildNetWorthFromTracks,
  buildRadarFromTracks,
  buildStressFromTracks,
  buildMoneyFromTracks,
  buildTimelineFromTracks,
} from "../utils/deriveData";

import TabNav from "./TabNav";
import Explore from "./Explore";
import Compare from "./Compare";
import DecisionTree from "./DecisionTree";
import Sources from "./Sources";
import PicksBar from "./PicksBar";

// all available profession families (add new ones here when ready)
const FAMILIES = {
  healthcare: healthcareData,
};

const MAX_PICKS = 6;
const STORAGE_KEY = "crossrd-picks";

export default function App() {
  const [tab, setTab] = useState("explore");

  // for now just healthcare
  const data = FAMILIES.healthcare;

  // valid keys for this dataset
  const validKeys = useMemo(
    () => new Set(data.careers.map((c) => c.key)),
    [data]
  );

  // picks state — restored from localStorage
  const [picks, setPicks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved).filter((k) => validKeys.has(k));
      }
    } catch {}
    return [];
  });

  // persist picks
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
  }, [picks]);

  const togglePick = (key) => {
    setPicks((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= MAX_PICKS) return prev;
      return [...prev, key];
    });
  };

  // derive profession colors and labels
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

  // all careers with profession field
  const allCareers = useMemo(
    () =>
      data.careers.map((c) => {
        const track = data.tracks.find((t) => t.key === c.key);
        return { ...c, profession: track?.profession || "" };
      }),
    [data]
  );

  // flatten tracks for FullField table (raw_data at top level)
  const allTracks = useMemo(
    () =>
      data.tracks.map((t) => ({
        name: t.name,
        key: t.key,
        profession: t.profession,
        group: t.group,
        color: t.color,
        ...t.raw_data,
      })),
    [data]
  );

  // selected careers for comparison
  const selectedCareers = useMemo(
    () => picks.map((k) => allCareers.find((c) => c.key === k)).filter(Boolean),
    [picks, allCareers]
  );

  // derive chart data only when we have picks
  const netWorthData = useMemo(
    () => (picks.length >= 2 ? buildNetWorthFromTracks(data.tracks, picks) : []),
    [data.tracks, picks]
  );
  const radarData = useMemo(
    () => (picks.length >= 2 ? buildRadarFromTracks(data.tracks, picks) : []),
    [data.tracks, picks]
  );
  const stressData = useMemo(
    () => (picks.length >= 2 ? buildStressFromTracks(data.tracks, picks) : { scenarios: [], scores: [] }),
    [data.tracks, picks]
  );
  const moneyData = useMemo(
    () => (picks.length >= 2 ? buildMoneyFromTracks(data.tracks, picks) : []),
    [data.tracks, picks]
  );
  const timelineData = useMemo(
    () => (picks.length >= 2 ? buildTimelineFromTracks(data.tracks, picks) : []),
    [data.tracks, picks]
  );

  // show picks bar on explore and quiz tabs
  const showPicksBar = tab === "explore" || tab === "quiz";

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
      <TabNav activeTab={tab} onTabChange={setTab} />

      <div style={{ padding: "0 0 24px" }}>
        {tab === "explore" && (
          <Explore
            meta={data.meta}
            groups={data.groups}
            allTracks={allTracks}
            profColors={profColors}
            profLabels={profLabels}
            picks={picks}
            onTogglePick={togglePick}
          />
        )}
        {tab === "compare" && (
          <Compare
            picks={picks}
            allCareers={allCareers}
            onTogglePick={togglePick}
            profColors={profColors}
            profLabels={profLabels}
            netWorthData={netWorthData}
            radarData={radarData}
            stressData={stressData}
            moneyData={moneyData}
            timelineData={timelineData}
            selectedCareers={selectedCareers}
          />
        )}
        {tab === "quiz" && (
          <DecisionTree
            decisionTree={data.decision_tree}
            decisionTreeResults={data.decision_tree_results}
            ranking={data.ranking}
            allCareers={allCareers}
            picks={picks}
            onTogglePick={togglePick}
          />
        )}
        {tab === "sources" && <Sources />}
      </div>

      {showPicksBar && (
        <PicksBar
          picks={picks}
          allCareers={allCareers}
          onTogglePick={togglePick}
          onCompare={() => setTab("compare")}
        />
      )}
    </div>
  );
}
