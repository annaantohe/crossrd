// deriveData.js — client-side data derivation from per-track data
// builds chart-ready data structures for selected careers

const SNAPSHOT_AGES = [18, 23, 28, 33, 38, 43, 48, 53, 58, 65];

// radar dimension → category mapping (mirrors pipeline/config.py)
const RADAR_CATEGORY_MAP = {
  Money: [5, 7],
  Happiness: [12],
  "Free Time": [9],
  "Hard to Get In": [1, 2, 4],
  "Robot-Proof": [11],
  "Safety Net": [14],
};

const RADAR_DIMENSIONS = [
  { dim: "Money", emoji: "💰" },
  { dim: "Happiness", emoji: "😊" },
  { dim: "Free Time", emoji: "🏖️" },
  { dim: "Hard to Get In", emoji: "🚪" },
  { dim: "Robot-Proof", emoji: "🤖" },
  { dim: "Safety Net", emoji: "🛡️" },
];

function computeNetWorthAtAge(fin, age) {
  const undergradEnd = 18 + (fin.undergrad_years || 4);
  const schoolEnd = undergradEnd + (fin.prof_school_years || 4);
  const resEnd = schoolEnd + (fin.residency_years || 3);
  const practiceStart = resEnd + (fin.fellowship_years || 0);

  let cumulative = 0;
  const loanRate = (fin.loan_rate || 6.5) / 100;
  const livingExpGrowth = (fin.living_exp_growth || 2.5) / 100;

  for (let a = 18; a <= age && a <= 65; a++) {
    const yearsFromStart = a - 18;
    const living =
      (fin.living_expenses || 50) * Math.pow(1 + livingExpGrowth, yearsFromStart);

    let net;
    if (a < undergradEnd) {
      net = -((fin.undergrad_cost_per_yr || 35) + living);
    } else if (a < schoolEnd) {
      net = -((fin.prof_school_cost_per_yr || 60) + living);
    } else if (a < practiceStart) {
      net = (fin.trainee_salary || 65) - living;
    } else {
      const yrs = a - practiceStart;
      let salary;
      if (a <= 40) {
        const totalYearsTo40 = Math.max(1, 40 - practiceStart);
        const progress = Math.min(1, yrs / totalYearsTo40);
        salary =
          (fin.starting_salary || 300) +
          progress * ((fin.mid_salary || 400) - (fin.starting_salary || 300));
      } else if (a <= 48) {
        const progress = (a - 40) / 8;
        salary =
          (fin.mid_salary || 400) +
          progress * ((fin.peak_salary || 600) - (fin.mid_salary || 400));
      } else {
        salary =
          (fin.peak_salary || 600) *
          Math.pow(1 + (fin.post_peak_growth || 1) / 100, a - 48);
      }
      let costs = living + (fin.malpractice_per_yr || 10) + (fin.overhead_per_yr || 5);
      if (yrs < 10) {
        costs += ((fin.education_debt || 350) / 10) * (1 + loanRate);
      }
      net = salary - costs;
    }
    cumulative += net;
  }
  return Math.round(cumulative);
}

export function buildNetWorthFromTracks(tracks, selectedKeys) {
  return SNAPSHOT_AGES.map((age) => {
    const point = { age };
    for (const key of selectedKeys) {
      const track = tracks.find((t) => t.key === key);
      if (!track?.financial) continue;
      point[key] = computeNetWorthAtAge(track.financial, age);
    }
    return point;
  });
}

export function buildRadarFromTracks(tracks, selectedKeys) {
  return RADAR_DIMENSIONS.map((dim) => {
    const point = { dim: dim.dim, emoji: dim.emoji };
    const catIds = RADAR_CATEGORY_MAP[dim.dim];
    for (const key of selectedKeys) {
      const track = tracks.find((t) => t.key === key);
      if (!track?.scores) continue;
      const vals = catIds.map((c) => track.scores[`category_${c}`] || 5);
      point[key] = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
    }
    return point;
  });
}

export function buildStressFromTracks(tracks, selectedKeys) {
  const scenarios = [
    { id: "ai", label: "🤖 AI Takes Job" },
    { id: "pay", label: "💸 Pay Cut 20%" },
    { id: "injury", label: "🤕 Hurt Hands" },
    { id: "match", label: "❌ Not Accepted" },
  ];
  return {
    scenarios,
    scores: selectedKeys
      .map((key) => {
        const track = tracks.find((t) => t.key === key);
        if (!track?.stress) return null;
        const s = track.stress;
        return {
          key,
          ...s,
          avg:
            Math.round(
              ((s.ai + s.pay + s.injury + s.match) / 4) * 10,
            ) / 10,
        };
      })
      .filter(Boolean),
  };
}

export function buildMoneyFromTracks(tracks, selectedKeys) {
  return selectedKeys
    .map((key) => {
      const track = tracks.find((t) => t.key === key);
      if (!track?.financial) return null;
      const fin = track.financial;
      return {
        key,
        start: fin.starting_salary || track.raw_data?.startSalary || 0,
        peak: fin.peak_salary || track.raw_data?.peakSalary || 0,
        lifetime: computeNetWorthAtAge(fin, 65),
      };
    })
    .filter(Boolean);
}

export function buildTimelineFromTracks(tracks, selectedKeys) {
  return selectedKeys
    .map((key) => {
      const track = tracks.find((t) => t.key === key);
      return track?.timeline ? { key, ...track.timeline } : null;
    })
    .filter(Boolean);
}

export { RADAR_DIMENSIONS, RADAR_CATEGORY_MAP };
