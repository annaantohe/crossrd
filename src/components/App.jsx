// App.jsx — Main app shell
// Multi-family support: FamilyPicker → 4 tabs (Explore, Compare, Quiz, Sources)
// Manages family state + picks state (persisted in localStorage) and derives chart data.

import { useState, useEffect, useMemo } from "react";
import healthcareData from "../data/healthcare.json";
import lawData from "../data/law.json";
import {
  buildNetWorthFromTracks,
  buildRadarFromTracks,
  buildStressFromTracks,
  buildMoneyFromTracks,
  buildTimelineFromTracks,
} from "../utils/deriveData";

import FamilyPicker from "./FamilyPicker";
import TabNav from "./TabNav";
import Explore from "./Explore";
import Compare from "./Compare";
import DecisionTree from "./DecisionTree";
import Sources from "./Sources";
import PicksBar from "./PicksBar";

// all available profession families
const FAMILIES = {
  healthcare: healthcareData,
  law: lawData,
};

const MAX_PICKS = 6;
const FAMILY_KEY = "crossrd-family";

export default function App() {
  const [tab, setTab] = useState("explore");

  // family state — null = show picker
  const [family, setFamily] = useState(() => {
    try {
      return localStorage.getItem(FAMILY_KEY) || null;
    } catch {
      return null;
    }
  });

  // persist family choice
  useEffect(() => {
    if (family) {
      localStorage.setItem(FAMILY_KEY, family);
    } else {
      localStorage.removeItem(FAMILY_KEY);
    }
  }, [family]);

  // per-family picks storage key
  const storageKey = family ? `crossrd-picks-${family}` : null;

  // current dataset
  const data = family ? FAMILIES[family] : null;

  // valid keys for this dataset
  const validKeys = useMemo(
    () => (data ? new Set(data.careers.map((c) => c.key)) : new Set()),
    [data]
  );

  // picks state — restored from localStorage (per family)
  const [picks, setPicks] = useState(() => {
    if (!storageKey) return [];
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved).filter((k) => validKeys.has(k));
      }
    } catch {}
    return [];
  });

  // reload picks when family changes
  useEffect(() => {
    if (!storageKey) {
      setPicks([]);
      return;
    }
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved).filter((k) => validKeys.has(k));
        setPicks(parsed);
      } else {
        setPicks([]);
      }
    } catch {
      setPicks([]);
    }
  }, [family, storageKey, validKeys]);

  // persist picks
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(picks));
    }
  }, [picks, storageKey]);

  const togglePick = (key) => {
    setPicks((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= MAX_PICKS) return prev;
      return [...prev, key];
    });
  };

  const switchFamily = () => {
    setFamily(null);
    setTab("explore");
  };

  // if no family selected, show picker
  if (!family || !data) {
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
        <FamilyPicker families={FAMILIES} onSelect={setFamily} />
      </div>
    );
  }

  // derive profession colors and labels
  const profColors = {};
  Object.entries(data.professions).forEach(([key, val]) => {
    profColors[key] = val.color;
  });

  const profLabels = {};
  Object.entries(data.professions).forEach(([key, val]) => {
    profLabels[key] = val.label;
  });

  // all careers with profession field
  const allCareers = data.careers.map((c) => {
    const track = data.tracks.find((t) => t.key === c.key);
    return { ...c, profession: track?.profession || "" };
  });

  // flatten tracks for FullField table (raw_data at top level)
  const allTracks = data.tracks.map((t) => ({
    name: t.name,
    key: t.key,
    profession: t.profession,
    group: t.group,
    color: t.color,
    ...t.raw_data,
  }));

  // selected careers for comparison
  const selectedCareers = picks
    .map((k) => allCareers.find((c) => c.key === k))
    .filter(Boolean);

  // derive chart data only when we have picks
  const netWorthData =
    picks.length >= 2 ? buildNetWorthFromTracks(data.tracks, picks) : [];
  const radarData =
    picks.length >= 2 ? buildRadarFromTracks(data.tracks, picks) : [];
  const stressData =
    picks.length >= 2
      ? buildStressFromTracks(data.tracks, picks)
      : { scenarios: [], scores: [] };
  const moneyData =
    picks.length >= 2 ? buildMoneyFromTracks(data.tracks, picks) : [];
  const timelineData =
    picks.length >= 2 ? buildTimelineFromTracks(data.tracks, picks) : [];

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
      {/* family switcher bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 12px 0",
          background: "white",
        }}
      >
        <button
          onClick={switchFamily}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            padding: "4px 12px",
            borderRadius: 12,
            border: "1px solid #e8e8e8",
            background: "#fafaf8",
            cursor: "pointer",
            color: "#888",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {data.meta.icon} {data.meta.family_name}
          <span style={{ color: "#ccc" }}>·</span>
          <span style={{ color: "#D4A537" }}>switch</span>
        </button>
      </div>

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
        {tab === "sources" && <Sources familySlug={family} />}
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
