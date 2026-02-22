// Methodology.jsx — explains the scoring framework, data points, and evaluation process
// Universal across all families — no props needed.

import { useState } from "react";
import { styles } from "../styles/theme";

// the 14 scoring categories with their data points (from data_points_framework.yaml)
const CATEGORIES = [
  {
    id: 1,
    name: "Pre-Professional Phase",
    description: "How hard is it to start?",
    weight: 7,
    emoji: "📚",
    points: [
      { id: 1, name: "Required undergraduate degree or prerequisites", layer: "L1", type: "Reference" },
      { id: 2, name: "Typical years of undergrad required", layer: "L1", type: "Decision" },
      { id: 3, name: "Required standardized test", layer: "L1", type: "Reference" },
      { id: 4, name: "Test difficulty / average competitive scores", layer: "L1", type: "Decision" },
      { id: 5, name: "GPA expectations (science + cumulative)", layer: "L1", type: "Decision" },
      { id: 6, name: "Extracurricular expectations", layer: "L1", type: "Decision" },
      { id: 7, name: "Is post-baccalaureate year common/expected?", layer: "L1", type: "Reference" },
    ],
  },
  {
    id: 2,
    name: "Admissions Competitiveness",
    description: "Can you realistically get in?",
    weight: 7,
    emoji: "🎯",
    points: [
      { id: 8, name: "Number of applicants per year (national)", layer: "L1", type: "Reference" },
      { id: 9, name: "Number of seats/spots available", layer: "L1", type: "Reference" },
      { id: 10, name: "Acceptance rate", layer: "L1", type: "Decision" },
      { id: 11, name: "Average number of applications per candidate", layer: "L1", type: "Reference" },
      { id: 12, name: "Reapplicant rate", layer: "L1", type: "Reference" },
      { id: 13, name: "Career changers welcome?", layer: "L1", type: "Decision" },
      { id: 14, name: "Role of state residency / connections", layer: "L1", type: "Reference" },
    ],
  },
  {
    id: 3,
    name: "Professional School",
    description: "What's the school experience like?",
    weight: 5,
    emoji: "🎓",
    points: [
      { id: 15, name: "Degree granted", layer: "L1", type: "Reference" },
      { id: 16, name: "Duration of program (years)", layer: "L1", type: "Decision" },
      { id: 17, name: "Curriculum structure (classroom vs. clinical split)", layer: "L1", type: "Reference" },
      { id: 18, name: "When does hands-on / patient contact begin?", layer: "L1", type: "Decision" },
      { id: 19, name: "Board exams during school (how many, when)", layer: "L1", type: "Reference" },
      { id: 20, name: "Attrition / dropout rate", layer: "L1", type: "Reference" },
      { id: 21, name: "Typical class size", layer: "L1", type: "Reference" },
      { id: 22, name: "Number of accredited schools in U.S.", layer: "L1", type: "Reference" },
      { id: 23, name: "Does school prestige matter for career outcomes?", layer: "L1", type: "Decision" },
    ],
  },
  {
    id: 4,
    name: "Post-Graduate Training",
    description: "How long/hard is the road after school?",
    weight: 8,
    emoji: "🏥",
    points: [
      { id: 24, name: "Is residency / post-grad training required?", layer: "L1", type: "Decision" },
      { id: 25, name: "Residency duration by specialty", layer: "L2", type: "Decision" },
      { id: 26, name: "Fellowship options and duration", layer: "L2", type: "Decision" },
      { id: 27, name: "Formal match process?", layer: "L1", type: "Reference" },
      { id: 28, name: "Competitiveness of match by specialty", layer: "L2", type: "Decision" },
      { id: 29, name: "Compensation during residency / training", layer: "L1", type: "Reference" },
      { id: 30, name: "Moonlighting opportunities during training", layer: "L1", type: "Reference" },
      { id: 31, name: "Board certification process after training", layer: "L1", type: "Reference" },
      { id: 32, name: "Total years: start \u2192 independent practice", layer: "Both", type: "Decision" },
    ],
  },
  {
    id: 5,
    name: "Financial Picture",
    description: "Cost, debt, time to financial freedom",
    weight: 10,
    emoji: "💸",
    points: [
      { id: 33, name: "Average tuition (total program cost)", layer: "L1", type: "Decision" },
      { id: 34, name: "Average total debt at graduation", layer: "L1", type: "Decision" },
      { id: 35, name: "Typical debt-to-income ratio at career start", layer: "Both", type: "Decision" },
      { id: 36, name: "Scholarship / military / service options", layer: "L1", type: "Reference" },
      { id: 37, name: "Income during training years", layer: "L1", type: "Reference" },
      { id: 38, name: "Time to break even financially", layer: "Both", type: "Decision" },
      { id: 39, name: "Loan forgiveness programs available", layer: "L1", type: "Reference" },
      { id: 40, name: "Opportunity cost (years of lost earning)", layer: "Both", type: "Decision" },
    ],
  },
  {
    id: 6,
    name: "Scope of Practice & Autonomy",
    description: "What can you do independently?",
    weight: 8,
    emoji: "⚖️",
    points: [
      { id: 41, name: "What can you legally do?", layer: "L1", type: "Decision" },
      { id: 42, name: "Scope variation by state", layer: "L1", type: "Decision" },
      { id: 43, name: "Independent practice vs. oversight required", layer: "L1", type: "Decision" },
      { id: 44, name: "Privileges (facility access, admitting)", layer: "L1", type: "Decision" },
      { id: 45, name: "Ability to expand scope over career", layer: "L1", type: "Decision" },
      { id: 46, name: "Turf wars / political battles over scope", layer: "L1", type: "Decision" },
      { id: 47, name: "Referral dynamics (who refers to whom)", layer: "L1", type: "Reference" },
    ],
  },
  {
    id: 7,
    name: "Career Economics",
    description: "How much do you earn over a career?",
    weight: 12,
    emoji: "💰",
    points: [
      { id: 48, name: "Starting salary by specialty", layer: "L2", type: "Decision" },
      { id: 49, name: "Mid-career salary range", layer: "L2", type: "Decision" },
      { id: 50, name: "Peak earning potential", layer: "L2", type: "Decision" },
      { id: 51, name: "Compensation models (salary, commission, ownership)", layer: "L2", type: "Reference" },
      { id: 52, name: "Practice / business ownership potential", layer: "L1", type: "Decision" },
      { id: 53, name: "Industry reimbursement / revenue trends", layer: "L1", type: "Decision" },
      { id: 54, name: "Revenue per client interaction", layer: "L2", type: "Reference" },
      { id: 55, name: "Part-time / flexible earning potential", layer: "L2", type: "Decision" },
    ],
  },
  {
    id: 8,
    name: "Daily Life & Practice Reality",
    description: "What does the work feel like?",
    weight: 8,
    emoji: "🔨",
    points: [
      { id: 56, name: "Typical daily workflow description", layer: "L2", type: "Reference" },
      { id: 57, name: "Caseload / volume per day", layer: "L2", type: "Reference" },
      { id: 58, name: "Hands-on procedure mix vs. desk work", layer: "L2", type: "Decision" },
      { id: 59, name: "Call schedule / after-hours expectations", layer: "L2", type: "Decision" },
      { id: 60, name: "Administrative burden", layer: "L2", type: "Decision" },
      { id: 61, name: "Support staff / team model", layer: "L2", type: "Reference" },
      { id: 62, name: "Practice settings available", layer: "L1", type: "Reference" },
      { id: 63, name: "Average hours per week", layer: "L2", type: "Decision" },
    ],
  },
  {
    id: 9,
    name: "Lifestyle & Work-Life Balance",
    description: "Can you have a life outside work?",
    weight: 10,
    emoji: "🌴",
    points: [
      { id: 63, name: "Average hours per week", layer: "L2", type: "Decision", note: "also in Cat 8" },
      { id: 64, name: "Burnout rates", layer: "L2", type: "Decision" },
      { id: 65, name: "Flexibility to go part-time", layer: "L2", type: "Decision" },
      { id: 66, name: "Vacation time (typical weeks/year)", layer: "L2", type: "Decision" },
      { id: 67, name: "Career longevity", layer: "L2", type: "Decision" },
      { id: 68, name: "Litigation / lawsuit frequency", layer: "L2", type: "Decision" },
      { id: 69, name: "Liability insurance costs", layer: "L2", type: "Decision" },
      { id: 70, name: "Geographic flexibility", layer: "L2", type: "Decision" },
    ],
  },
  {
    id: 10,
    name: "Job Market & Demand",
    description: "Will you find work?",
    weight: 5,
    emoji: "📈",
    points: [
      { id: 71, name: "Current job market (shortage vs. saturated)", layer: "Both", type: "Decision" },
      { id: 72, name: "Projected demand next 10-20 years", layer: "Both", type: "Decision" },
      { id: 73, name: "Geographic demand variation", layer: "L2", type: "Reference" },
      { id: 74, name: "Impact of demographic changes", layer: "L1", type: "Decision" },
      { id: 75, name: "Vulnerability to scope encroachment", layer: "L1", type: "Decision" },
      { id: 76, name: "Remote work / telehealth potential", layer: "L2", type: "Reference" },
    ],
  },
  {
    id: 11,
    name: "AI Revolution Impact",
    description: "How future-proof is this career?",
    weight: 7,
    emoji: "🤖",
    points: [
      { id: 77, name: "AI impact on core tasks", layer: "Both", type: "Decision" },
      { id: 78, name: "Automation risk for routine work", layer: "L2", type: "Decision" },
      { id: 79, name: "AI as tool (enhances) vs. replacement", layer: "Both", type: "Decision" },
      { id: 80, name: "Timeline of likely disruption", layer: "Both", type: "Decision" },
      { id: 81, name: "Insulation by hands-on factor", layer: "L2", type: "Decision" },
      { id: 82, name: "Regulatory barriers slowing AI adoption", layer: "L1", type: "Reference" },
    ],
  },
  {
    id: 12,
    name: "Professional Satisfaction",
    description: "Will you enjoy this long-term?",
    weight: 8,
    emoji: "😊",
    points: [
      { id: 83, name: "Career satisfaction survey data", layer: "L2", type: "Decision" },
      { id: 84, name: "'Would you choose this again?' rates", layer: "L2", type: "Decision" },
      { id: 85, name: "Prestige / public perception", layer: "L1", type: "Reference" },
      { id: 86, name: "Intellectual stimulation over time", layer: "L2", type: "Decision" },
      { id: 87, name: "Variety vs. repetition in daily work", layer: "L2", type: "Decision" },
      { id: 88, name: "Impact on people's lives", layer: "L2", type: "Decision" },
      { id: 89, name: "Teaching / academic opportunities", layer: "L1", type: "Reference" },
      { id: 90, name: "Research opportunities if desired", layer: "L1", type: "Reference" },
      { id: 91, name: "Ease of pivoting to adjacent careers", layer: "L1", type: "Decision" },
    ],
  },
  {
    id: 13,
    name: "Demographics & Culture",
    description: "Culture fit?",
    weight: 3,
    emoji: "🌍",
    points: [
      { id: 92, name: "Current male/female ratio", layer: "L1", type: "Reference" },
      { id: 93, name: "Gender trend direction", layer: "L1", type: "Reference" },
      { id: 94, name: "Gender distribution across specialties", layer: "L2", type: "Reference" },
      { id: 95, name: "Pay equity data (gender pay gap)", layer: "Both", type: "Decision" },
      { id: 96, name: "Parental leave norms and culture", layer: "L1", type: "Decision" },
      { id: 97, name: "Mentorship availability", layer: "L1", type: "Reference" },
      { id: 98, name: "Culture and 'old guard' dynamics", layer: "L1", type: "Decision" },
      { id: 99, name: "Diversity of practitioners", layer: "L1", type: "Reference" },
      { id: 100, name: "Welcoming to career changers / non-traditional?", layer: "L1", type: "Decision" },
    ],
  },
  {
    id: 14,
    name: "Risk Factors & Downsides",
    description: "Hidden costs and dangers",
    weight: 5,
    emoji: "🛡️",
    points: [
      { id: 101, name: "Physical toll on body", layer: "L2", type: "Decision" },
      { id: 102, name: "Emotional toll", layer: "L2", type: "Decision" },
      { id: 103, name: "Liability exposure", layer: "L2", type: "Decision" },
      { id: 104, name: "Regulatory burden and trends", layer: "L1", type: "Decision" },
      { id: 105, name: "Continuing education requirements", layer: "L1", type: "Reference" },
      { id: 106, name: "Recertification requirements and costs", layer: "L1", type: "Reference" },
      { id: 107, name: "Risk of career disruption from injury", layer: "L2", type: "Decision" },
    ],
  },
];

const RADAR_DIMS = [
  { emoji: "💰", name: "Money", cats: "Categories 5, 7" },
  { emoji: "😊", name: "Happiness", cats: "Category 12" },
  { emoji: "⏰", name: "Free Time", cats: "Category 9" },
  { emoji: "🎯", name: "Hard to Get In", cats: "Categories 1, 2, 4" },
  { emoji: "🤖", name: "Robot-Proof", cats: "Category 11" },
  { emoji: "🛡️", name: "Safety Net", cats: "Category 14" },
];

const SCENARIOS = [
  { name: "Default", desc: "Balanced weighting that reflects a typical student's priorities" },
  { name: "Equal Weight", desc: "All 14 categories weighted equally" },
  { name: "Max Earnings", desc: "Heavily weights salary, career economics, and financial picture" },
  { name: "Best Lifestyle", desc: "Prioritizes work-life balance, flexibility, and low burnout" },
  { name: "Fastest to Practice", desc: "Rewards shorter training, easier entry, and quicker earning" },
  { name: "Most Hands-On", desc: "Values procedural work, scope of practice, and career pivoting" },
];

// shared card style
const card = {
  background: "#fff",
  borderRadius: 10,
  padding: "10px 14px",
  marginBottom: 8,
  border: "1px solid #e8e8e8",
};

const sectionHeader = {
  fontSize: 16,
  fontWeight: 700,
  color: "#1a1a2e",
  margin: "20px 0 8px",
  fontFamily: "'DM Sans', sans-serif",
};

// layer badge colors
const layerColor = { L1: "#6a1b9a", L2: "#1565c0", Both: "#2e7d32" };

export default function Methodology() {
  const [open, setOpen] = useState({});

  const toggle = (id) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalDecision = CATEGORIES.reduce(
    (sum, cat) => sum + cat.points.filter((p) => p.type === "Decision").length,
    0
  );
  const totalReference = CATEGORIES.reduce(
    (sum, cat) => sum + cat.points.filter((p) => p.type === "Reference").length,
    0
  );

  return (
    <div style={{ padding: "8px 12px" }}>
      <h2 style={styles.header}>Methodology</h2>
      <p style={styles.subtitle}>
        How we evaluate and score every career
      </p>

      {/* overview banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #ede7f6, #e8eaf6)",
          borderRadius: 12,
          padding: "14px 16px",
          margin: "0 4px 16px",
          border: "1px solid #d1c4e9",
          fontSize: 13,
          color: "#555",
          lineHeight: 1.6,
        }}
      >
        Every career in crossrd is evaluated using <strong>107 data points</strong> organized
        into <strong>14 scoring categories</strong>. Each data point is scored on a{" "}
        <strong>1-10 scale</strong>, then averaged within its category to produce a category
        score. These category scores power the radar charts, ranking scenarios, and
        comparison tools across the site.
      </div>

      {/* stats row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "0 4px 20px",
          textAlign: "center",
        }}
      >
        {[
          { n: "107", label: "Data Points" },
          { n: "14", label: "Categories" },
          { n: String(totalDecision), label: "Decision" },
          { n: String(totalReference), label: "Reference" },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#D4A537", fontFamily: "'Playfair Display', serif" }}>
              {s.n}
            </div>
            <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* how scoring works */}
      <h3 style={sectionHeader}>🧮 How Scoring Works</h3>
      <div style={{ ...card, lineHeight: 1.6, fontSize: 13, color: "#555" }}>
        <p style={{ margin: "0 0 8px" }}>
          <strong style={{ color: "#1a1a2e" }}>Decision vs. Reference:</strong>{" "}
          Decision data points are converted to a 1-10 score and directly affect
          rankings. Reference data points are informational only — they provide
          context but don't change the score.
        </p>
        <p style={{ margin: "0 0 8px" }}>
          <strong style={{ color: "#1a1a2e" }}>L1 vs. L2 layers:</strong>{" "}
          L1 scores are set at the profession level (e.g., all electricians share
          the same admissions score). L2 scores vary by specialty (e.g., a lineman's
          salary differs from a fire alarm technician's). Categories that use both
          layers blend them together.
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: "#1a1a2e" }}>Conversion:</strong>{" "}
          Raw values (like salary in dollars or hours per week) are mapped to a
          1-10 scale using a linear conversion with defined min/max bounds. Some
          values are inverted — for example, fewer hours = higher score. Values
          already on a 1-10 scale pass through directly.
        </p>
      </div>

      {/* the 14 categories */}
      <h3 style={sectionHeader}>📋 The 14 Categories</h3>
      <p style={{ fontSize: 12, color: "#888", margin: "0 4px 10px", lineHeight: 1.4 }}>
        Tap any category to see its data points. <strong>Decision</strong> points
        affect scoring; <em>Reference</em> points are context only.
      </p>

      {CATEGORIES.map((cat) => {
        const isOpen = open[cat.id];
        const decCount = cat.points.filter((p) => p.type === "Decision").length;
        const refCount = cat.points.length - decCount;

        return (
          <div key={cat.id} style={{ ...card, cursor: "pointer", margin: "0 4px 6px" }}>
            <div
              onClick={() => toggle(cat.id)}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ fontSize: 18 }}>{cat.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>
                  {cat.id}. {cat.name}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {cat.description} · {cat.points.length} points ({decCount}D / {refCount}R) · weight {cat.weight}
                </div>
              </div>
              <span style={{ fontSize: 14, color: "#bbb", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none" }}>
                ▶
              </span>
            </div>

            {isOpen && (
              <div style={{ marginTop: 10, borderTop: "1px solid #f0f0f0", paddingTop: 8 }}>
                {cat.points.map((pt) => (
                  <div
                    key={`${pt.id}-${pt.name}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "4px 0",
                      fontSize: 13,
                      color: pt.type === "Decision" ? "#333" : "#aaa",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        padding: "1px 5px",
                        borderRadius: 4,
                        background: `${layerColor[pt.layer]}15`,
                        color: layerColor[pt.layer],
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {pt.layer}
                    </span>
                    <span style={{ flex: 1 }}>{pt.name}</span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: pt.type === "Decision" ? "#2e7d32" : "#bbb",
                        flexShrink: 0,
                      }}
                    >
                      {pt.type === "Decision" ? "DECISION" : "REF"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* radar chart dimensions */}
      <h3 style={sectionHeader}>🎯 Radar Chart Dimensions</h3>
      <div style={{ ...card, margin: "0 4px 6px" }}>
        <p style={{ fontSize: 13, color: "#555", margin: "0 0 10px", lineHeight: 1.5 }}>
          The radar chart condenses 14 categories into 6 easy-to-read dimensions.
          Each dimension is the average of one or more category scores.
        </p>
        {RADAR_DIMS.map((d) => (
          <div
            key={d.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 0",
              fontSize: 13,
            }}
          >
            <span style={{ fontSize: 16 }}>{d.emoji}</span>
            <strong style={{ color: "#1a1a2e", minWidth: 110 }}>{d.name}</strong>
            <span style={{ color: "#888" }}>{d.cats}</span>
          </div>
        ))}
      </div>

      {/* scenario profiles */}
      <h3 style={sectionHeader}>🎚️ Scenario Profiles</h3>
      <div style={{ ...card, margin: "0 4px 6px" }}>
        <p style={{ fontSize: 13, color: "#555", margin: "0 0 10px", lineHeight: 1.5 }}>
          Different students have different priorities. Scenario profiles re-weight
          the 14 categories so careers are ranked by what matters most to you.
        </p>
        {SCENARIOS.map((s) => (
          <div key={s.name} style={{ padding: "4px 0", fontSize: 13 }}>
            <strong style={{ color: "#1a1a2e" }}>{s.name}:</strong>{" "}
            <span style={{ color: "#555" }}>{s.desc}</span>
          </div>
        ))}
      </div>

      {/* financial model */}
      <h3 style={sectionHeader}>💵 Financial Model</h3>
      <div style={{ ...card, margin: "0 4px 6px", lineHeight: 1.6, fontSize: 13, color: "#555" }}>
        <p style={{ margin: "0 0 8px" }}>
          The net worth comparison chart simulates a career's financial trajectory
          from age 18 to 65. It accounts for:
        </p>
        <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
          <li><strong>Education costs</strong> — tuition, living expenses during school</li>
          <li><strong>Student debt</strong> — loan principal and interest accumulation</li>
          <li><strong>Training income</strong> — salary during residency, apprenticeship, or internship</li>
          <li><strong>Career earnings</strong> — starting salary growing to mid-career then peak</li>
          <li><strong>Living expenses</strong> — adjusted for inflation over the career</li>
          <li><strong>NPV discount</strong> — all figures discounted to present value at 5% for fair comparison</li>
        </ul>
      </div>

      {/* stress test */}
      <h3 style={sectionHeader}>🧪 Stress Test</h3>
      <div style={{ ...card, margin: "0 4px 6px", lineHeight: 1.6, fontSize: 13, color: "#555" }}>
        <p style={{ margin: 0 }}>
          The stress test evaluates how resilient each career is under four
          challenging scenarios: AI automation, economic downturn, career-ending
          injury, and difficulty getting into the field. Each career gets a
          resilience score (1-10) per scenario, based on profession-level
          baselines and specialty-specific factors.
        </p>
      </div>

      {/* footer */}
      <div
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#aaa",
          padding: "16px 0 8px",
          borderTop: "1px solid #eee",
          margin: "20px 4px 0",
        }}
      >
        Framework version 4.0 · February 2026
      </div>
    </div>
  );
}
