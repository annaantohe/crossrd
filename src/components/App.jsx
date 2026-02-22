// App.jsx — Main app shell
// Multi-family support: FamilyPicker → 4 tabs (Explore, Compare, Quiz, Sources)
// Manages family state + picks state (persisted in localStorage) and derives chart data.

import { useState, useEffect, useMemo } from "react";
import healthcareData from "../data/healthcare.json";
import lawData from "../data/law.json";
import engineeringData from "../data/engineering.json";
import businessData from "../data/business.json";
import governmentData from "../data/government.json";
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
  engineering: engineeringData,
  business: businessData,
  government: governmentData,
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

  // --- cross-family merged data for Compare tab ---
  // tick counter to force re-derive when other families' picks change
  const [mergedTick, setMergedTick] = useState(0);

  const mergedTracks = useMemo(() => {
    const tracks = [];
    for (const [slug, fd] of Object.entries(FAMILIES)) {
      for (const t of fd.tracks) {
        tracks.push({ ...t, family: slug });
      }
    }
    return tracks;
  }, []);

  const mergedCareers = useMemo(() => {
    const careers = [];
    for (const [slug, fd] of Object.entries(FAMILIES)) {
      for (const c of fd.careers) {
        const track = fd.tracks.find((t) => t.key === c.key);
        careers.push({
          ...c,
          profession: track?.profession || "",
          family: slug,
          familyIcon: fd.meta.icon,
          familyName: fd.meta.family_name,
        });
      }
    }
    return careers;
  }, []);

  const mergedProfColors = useMemo(() => {
    const colors = {};
    for (const fd of Object.values(FAMILIES)) {
      Object.entries(fd.professions).forEach(([k, v]) => { colors[k] = v.color; });
    }
    return colors;
  }, []);

  const mergedProfLabels = useMemo(() => {
    const labels = {};
    for (const fd of Object.values(FAMILIES)) {
      Object.entries(fd.professions).forEach(([k, v]) => { labels[k] = v.label; });
    }
    return labels;
  }, []);

  // read picks from ALL families
  // use React state for current family (localStorage may be stale during render)
  const allPicks = useMemo(() => {
    void mergedTick; // depend on tick
    const merged = [];
    for (const slug of Object.keys(FAMILIES)) {
      if (slug === family) {
        merged.push(...picks);
      } else {
        try {
          const saved = localStorage.getItem(`crossrd-picks-${slug}`);
          if (saved) merged.push(...JSON.parse(saved));
        } catch {}
      }
    }
    return merged;
  }, [picks, family, mergedTick]);

  // derive merged chart data
  const mergedSelected = allPicks
    .map((k) => mergedCareers.find((c) => c.key === k))
    .filter(Boolean);
  const mergedNetWorth =
    allPicks.length >= 2 ? buildNetWorthFromTracks(mergedTracks, allPicks) : [];
  const mergedRadar =
    allPicks.length >= 2 ? buildRadarFromTracks(mergedTracks, allPicks) : [];
  const mergedStress =
    allPicks.length >= 2
      ? buildStressFromTracks(mergedTracks, allPicks)
      : { scenarios: [], scores: [] };
  const mergedMoney =
    allPicks.length >= 2 ? buildMoneyFromTracks(mergedTracks, allPicks) : [];
  const mergedTimeline =
    allPicks.length >= 2 ? buildTimelineFromTracks(mergedTracks, allPicks) : [];

  // toggle pick from Compare (handles careers from any family)
  const togglePickCrossFamily = (key) => {
    for (const [slug, fd] of Object.entries(FAMILIES)) {
      if (fd.careers.some((c) => c.key === key)) {
        const sk = `crossrd-picks-${slug}`;
        try {
          const saved = localStorage.getItem(sk);
          const current = saved ? JSON.parse(saved) : [];
          if (current.includes(key)) {
            localStorage.setItem(sk, JSON.stringify(current.filter((k) => k !== key)));
          } else if (allPicks.length < MAX_PICKS) {
            localStorage.setItem(sk, JSON.stringify([...current, key]));
          }
        } catch {}
        if (slug === family) {
          togglePick(key);
        } else {
          setMergedTick((t) => t + 1);
        }
        break;
      }
    }
  };

  // jump straight to compare from front page
  const goCompare = () => {
    const firstFamily = Object.keys(FAMILIES)[0];
    setFamily(firstFamily);
    setTab("compare");
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
        <FamilyPicker families={FAMILIES} onSelect={setFamily} onCompare={goCompare} />
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
    aiRiskAvg: Math.round(((t.raw_data.aiRiskNow || 5) + (t.raw_data.aiRiskMedium || 5) + (t.raw_data.aiRiskLong || 5)) / 3 * 10) / 10,
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
            picks={allPicks}
            allCareers={mergedCareers}
            onTogglePick={togglePickCrossFamily}
            profColors={mergedProfColors}
            profLabels={mergedProfLabels}
            netWorthData={mergedNetWorth}
            radarData={mergedRadar}
            stressData={mergedStress}
            moneyData={mergedMoney}
            timelineData={mergedTimeline}
            selectedCareers={mergedSelected}
            tracks={mergedTracks}
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

      {/* footer */}
      <div
        style={{
          textAlign: "center",
          padding: "24px 12px 16px",
          fontSize: 11,
          color: "#bbb",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        © 2025 Anna Antohe · crossrd™
      </div>
    </div>
  );
}
