// Sources.jsx — Data sources and methodology references
// Shows grouped references for all data used in the career comparison.

import { styles } from "../styles/theme";

const SOURCE_CATEGORIES = [
  {
    title: "Compensation Data",
    emoji: "💰",
    sources: [
      {
        name: "Medscape Physician Compensation Report",
        org: "Medscape / WebMD Health",
        url: "https://www.medscape.com/sites/public/physician-comp/2025",
        desc: "Annual survey of 10,000+ U.S. physicians covering salary by specialty, practice setting, region, and gender. Covers MD/DO specialties including starting and experienced physician pay.",
        updated: "Annual (April)",
      },
      {
        name: "Doximity Physician Compensation Report",
        org: "Doximity, Inc.",
        url: "https://www.doximity.com/reports/physician-compensation-report/2025",
        desc: "Compensation data drawn from 230,000+ verified physician profiles over six years. Reports salary by specialty, metro area, gender pay gap, and year-over-year trends.",
        updated: "Annual (mid-year)",
      },
      {
        name: "MGMA Provider Compensation and Productivity Data",
        org: "Medical Group Management Association",
        url: "https://www.mgma.com/datadive/provider-compensation",
        desc: "Gold-standard industry benchmark for physician and advanced-practice provider compensation, wRVU productivity, and staffing ratios. Used by health systems for contract negotiations.",
        updated: "Annual (May)",
      },
      {
        name: "ADA Health Policy Institute — Income from Dentistry",
        org: "American Dental Association",
        url: "https://www.ada.org/resources/research/health-policy-institute/dental-practice-research/trends-in-dentist-income",
        desc: "Net income, gross billings, and practice expense data for general dentists and specialists from the ADA Survey of Dental Practice.",
        updated: "Annual",
      },
      {
        name: "AOA Survey of Optometric Practice — Income from Optometry",
        org: "American Optometric Association",
        url: "https://www.aoa.org/optometrists/tools-and-resources/research-and-information-center/survey-reports/survey-of-optometric-practice/income-from-optometry",
        desc: "Net income data for optometrists by practice mode, years in practice, and geographic region.",
        updated: "Periodic (most recent: 2022)",
      },
      {
        name: "BLS Occupational Outlook Handbook — Healthcare",
        org: "U.S. Bureau of Labor Statistics, Department of Labor",
        url: "https://www.bls.gov/ooh/healthcare/",
        desc: "Median annual wages, employment projections, and job outlook for physicians, dentists, podiatrists, and optometrists. Individual pages at bls.gov/ooh/healthcare/physicians-and-surgeons.htm, /dentists.htm, /podiatrists.htm, /optometrists.htm.",
        updated: "Annual (September)",
      },
      {
        name: "BLS Occupational Employment and Wage Statistics (OEWS)",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/oes/",
        desc: "Detailed wage percentiles (10th, 25th, median, 75th, 90th) by detailed occupation code and metropolitan area. Used for starting vs. peak salary estimates.",
        updated: "Annual (March)",
      },
    ],
  },
  {
    title: "Training & Match Data",
    emoji: "🎓",
    sources: [
      {
        name: "NRMP Results and Data — Main Residency Match",
        org: "National Resident Matching Program",
        url: "https://www.nrmp.org/match-data/2025/05/results-and-data-2025-main-residency-match/",
        desc: "Official match statistics: total applicants, positions offered, fill rates, and match rates broken down by specialty and applicant type (U.S. MD, DO, IMG).",
        updated: "Annual (May)",
      },
      {
        name: "Charting Outcomes in the Match",
        org: "National Resident Matching Program",
        url: "https://www.nrmp.org/match-data/2025/07/charting-outcomes-applicant-survey-results-2025-main-residency-match/",
        desc: "Applicant characteristics (board scores, research publications, volunteer work) of matched vs. unmatched applicants by specialty. Key source for competitiveness metrics.",
        updated: "Annual (July)",
      },
      {
        name: "NRMP Specialties Matching Service Data",
        org: "National Resident Matching Program",
        url: "https://www.nrmp.org/match-data/2025/02/results-and-data-specialties-matching-service-2025-appointment-year/",
        desc: "Match data for subspecialty fellowships (e.g., cardiology, GI, pulm/crit care) separate from the main residency match.",
        updated: "Annual (February)",
      },
      {
        name: "ACGME Common Program Requirements & Data Resource Book",
        org: "Accreditation Council for Graduate Medical Education",
        url: "https://www.acgme.org/programs-and-institutions/programs/common-program-requirements/",
        desc: "Residency and fellowship program requirements, training duration by specialty, duty-hour limits (80 hr/wk cap), and accreditation standards.",
        updated: "Continuous; major revision 2017",
      },
      {
        name: "AAMC Report on Residents",
        org: "Association of American Medical Colleges",
        url: "https://www.aamc.org/data-reports/students-residents/data/report-residents/2023/executive-summary",
        desc: "Graduate medical education (GME) data including number of residents and fellows by specialty, training duration, and demographics.",
        updated: "Annual",
      },
      {
        name: "AAMC Medical School Graduation Questionnaire (GQ)",
        org: "Association of American Medical Colleges",
        url: "https://www.aamc.org/data-reports",
        desc: "Career plans, specialty choice intentions, educational debt, and satisfaction of graduating medical students.",
        updated: "Annual",
      },
      {
        name: "ADEA Applicants, Enrollees, and Graduates Data",
        org: "American Dental Education Association",
        url: "https://www.adea.org/home/publications/research-and-data/applicants-enrollees-and-graduates",
        desc: "Dental school applicant volume, acceptance rates, DAT scores, and GPA profiles for each entering class.",
        updated: "Annual (Spring)",
      },
      {
        name: "AACPM CASPR Match & Statistics",
        org: "American Association of Colleges of Podiatric Medicine",
        url: "https://aacpm.org/statistics-2/",
        desc: "Podiatric medical school enrollment, applicant statistics, and residency match data via the CASPR/CRIP system.",
        updated: "Annual",
      },
      {
        name: "ASCO Data & Surveys / ORMatch Statistics",
        org: "Association of Schools and Colleges of Optometry / National Matching Services",
        url: "https://optometriceducation.org/data-reports/data-surveys/",
        desc: "Optometry school enrollment trends, applicant data, and residency match statistics via ORMatch (natmatch.com/ormatch).",
        updated: "Annual",
      },
      {
        name: "Residency Explorer",
        org: "AAMC / NRMP",
        url: "https://www.residencyexplorer.org/",
        desc: "Interactive tool with program-level data on interview invitations, board score ranges, and program characteristics by specialty.",
        updated: "Annual",
      },
    ],
  },
  {
    title: "Work-Life Balance & Burnout",
    emoji: "⚖️",
    sources: [
      {
        name: "Medscape Physician Mental Health & Well-Being Report",
        org: "Medscape / WebMD Health",
        url: "https://www.medscape.com/sites/public/mental-health/2025",
        desc: "Burnout rates, depression prevalence, happiness levels, and coping strategies surveyed across 15+ specialties (5,700+ respondents). Key source for specialty-level burnout data.",
        updated: "Annual (January/February)",
      },
      {
        name: "Medscape Physician Lifestyle & Happiness Report",
        org: "Medscape / WebMD Health",
        url: "https://www.medscape.com/sites/public/lifestyle/2024",
        desc: "Work-life balance ratings, hours worked per week, time spent on paperwork, vacation days, and outside-work happiness by specialty.",
        updated: "Annual",
      },
      {
        name: "AMA National Physician Burnout Survey",
        org: "American Medical Association",
        url: "https://www.ama-assn.org/practice-management/physician-health/national-physician-burnout-survey",
        desc: "Longitudinal burnout tracking using validated Maslach Burnout Inventory. Tracks burnout prevalence, emotional exhaustion, and depersonalization over time. Published in Mayo Clinic Proceedings.",
        updated: "Annual/Biennial",
      },
      {
        name: "AMA Physician Practice Benchmark Survey",
        org: "American Medical Association",
        url: "https://www.ama-assn.org/about/ama-research/physician-practice-benchmark-survey",
        desc: "Practice hours, ownership status, call schedules, administrative burden, and practice arrangement trends for U.S. physicians.",
        updated: "Biennial",
      },
      {
        name: "Physicians Foundation Survey of America's Physicians",
        org: "The Physicians Foundation",
        url: "https://physiciansfoundation.org/research/the-state-of-americas-physicians-2025-wellbeing-survey/",
        desc: "Physician morale, practice patterns, wellbeing, views on healthcare consolidation, and career satisfaction among 2,000+ physicians.",
        updated: "Biennial (most recent: 2025)",
      },
      {
        name: "ADA Well-Being Index & State of Dentist Well-Being Report",
        org: "American Dental Association",
        url: "https://www.ada.org/resources/practice/wellness",
        desc: "Burnout, fatigue, depression, and distress prevalence data for dentists. 46% of dentists report struggling or distressed status.",
        updated: "Annual (2024-2025)",
      },
      {
        name: "ACGME Section VI — Work Hour Requirements",
        org: "Accreditation Council for Graduate Medical Education",
        url: "https://www.acgme.org/programs-and-institutions/programs/common-program-requirements/summary-of-proposed-changes-to-acgme-common-program-requirements-section-vi/",
        desc: "Duty-hour limits for residents: 80 hr/wk averaged over 4 weeks, 24-hr maximum continuous duty, minimum rest periods. Defines the training-phase work-life floor.",
        updated: "Last major revision: July 2017",
      },
    ],
  },
  {
    title: "Career Satisfaction",
    emoji: "😊",
    sources: [
      {
        name: "Medscape Physician Compensation Report — Satisfaction Section",
        org: "Medscape / WebMD Health",
        url: "https://www.medscape.com/sites/public/physician-comp/2025",
        desc: "\"Would you choose medicine again?\" and specialty satisfaction questions embedded in the annual compensation survey.",
        updated: "Annual (April)",
      },
      {
        name: "Doximity Physician Compensation Report — Satisfaction Data",
        org: "Doximity, Inc.",
        url: "https://www.doximity.com/reports/physician-compensation-report/2025",
        desc: "Career satisfaction, intent to leave medicine, and work-strain indicators from the annual compensation survey.",
        updated: "Annual",
      },
      {
        name: "Physicians Foundation — Wellbeing & Satisfaction Survey",
        org: "The Physicians Foundation",
        url: "https://physiciansfoundation.org/surveys/",
        desc: "Comprehensive survey covering job satisfaction, career optimism, likelihood of recommending medicine as a career, and overall morale.",
        updated: "Biennial",
      },
      {
        name: "AAMC Graduation Questionnaire — Specialty Satisfaction",
        org: "Association of American Medical Colleges",
        url: "https://www.aamc.org/data-reports",
        desc: "Graduating medical students rate satisfaction with education and report career intentions, providing a baseline for early-career satisfaction.",
        updated: "Annual",
      },
    ],
  },
  {
    title: "Financial Modeling",
    emoji: "📊",
    sources: [
      {
        name: "AAMC Tuition and Student Fees Reports",
        org: "Association of American Medical Colleges",
        url: "https://www.aamc.org/data-reports/reporting-tools/report/tuition-and-student-fees-reports",
        desc: "Medical school tuition, fees, and health insurance costs from academic year 1996-97 through the most recent year, broken down by public/private and in-state/out-of-state.",
        updated: "Annual",
      },
      {
        name: "AAMC Physician Education Debt and Cost to Attend Medical School",
        org: "Association of American Medical Colleges",
        url: "https://www.aamc.org/data-reports/students-residents/report/physician-education-debt-and-cost-attend-medical-school",
        desc: "Average debt at graduation (~$200K+ for MD students), repayment projections, and cost-of-attendance trends. Primary source for medical school debt figures.",
        updated: "Annual",
      },
      {
        name: "ADEA Trends in Dental Education & Educational Debt Data",
        org: "American Dental Education Association",
        url: "https://www.adea.org/godental/Apply/financing-dental-education/educational-debt",
        desc: "Dental school educational debt data. Average dental graduate debt ~$296K. Includes breakdown by school type.",
        updated: "Annual",
      },
      {
        name: "ADA Health Policy Institute — Dental Education Economics",
        org: "American Dental Association",
        url: "https://www.ada.org/resources/research/health-policy-institute/dental-education",
        desc: "Dental education costs, tuition trends, and income-to-debt ratios for dental graduates.",
        updated: "Annual",
      },
      {
        name: "AACPM Financial Aid Information",
        org: "American Association of Colleges of Podiatric Medicine",
        url: "https://aacpm.org/becoming-a-podiatric-physician/financial-aid/",
        desc: "Podiatric medical school tuition data and financial aid resources. Average DPM graduate debt ~$230K.",
        updated: "Annual",
      },
      {
        name: "ASCO Financing an Optometric Education",
        org: "Association of Schools and Colleges of Optometry",
        url: "https://optometriceducation.org/future-students/resources/financing-an-optometric-education/",
        desc: "Optometry school cost data and financing resources. Average OD graduate debt ~$230K.",
        updated: "Annual",
      },
      {
        name: "Federal Student Aid — Loan Interest Rates",
        org: "U.S. Department of Education",
        url: "https://studentaid.gov/understand-aid/types/loans/interest-rates",
        desc: "Current federal student loan interest rates for graduate/professional students. For 2025-26: Direct Unsubsidized at 7.94%, Grad PLUS at 8.94%.",
        updated: "Annual (July 1 reset)",
      },
      {
        name: "Federal Reserve Bank of New York — Household Debt & Credit Report",
        org: "Federal Reserve Bank of New York",
        url: "https://www.newyorkfed.org/microeconomics/hhdc/background.html",
        desc: "Quarterly data on outstanding student loan balances ($1.66T total), delinquency rates, and trends in household debt composition.",
        updated: "Quarterly",
      },
      {
        name: "NCES Trends in Student Loan Debt for Graduate School Completers",
        org: "National Center for Education Statistics, U.S. Dept. of Education",
        url: "https://nces.ed.gov/programs/coe/indicator/tub/graduate-student-loan-debt",
        desc: "Cumulative loan balances by graduate degree type (professional doctorate vs. master's), institution control, and program. Based on the National Postsecondary Student Aid Study (NPSAS).",
        updated: "Periodic (tied to NPSAS cycles)",
      },
      {
        name: "Education Data Initiative — Student Loan Debt Statistics",
        org: "EducationData.org",
        url: "https://educationdata.org/average-medical-school-debt",
        desc: "Aggregated and cross-referenced debt statistics for medical, dental, optometry, and podiatry school graduates from federal and institutional sources.",
        updated: "Continuous",
      },
      {
        name: "BLS Consumer Expenditure Surveys",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/cex/",
        desc: "Living expense benchmarks (housing, food, transportation, healthcare) used to model post-training disposable income and savings rate in the financial model.",
        updated: "Annual",
      },
      {
        name: "CMS Medicare Physician Fee Schedule",
        org: "Centers for Medicare & Medicaid Services",
        url: "https://www.cms.gov/medicare/payment/physician-fee-schedule",
        desc: "Physician reimbursement rates (conversion factor) and year-over-year payment changes. Used for reimbursement-cut stress test scenarios.",
        updated: "Annual (November final rule for following CY)",
      },
    ],
  },
  {
    title: "Malpractice & Liability",
    emoji: "🛡️",
    sources: [
      {
        name: "Medical Liability Monitor — Annual Rate Survey",
        org: "Medical Liability Monitor (Fortified Health Security)",
        url: "https://medicalliabilitymonitor.com/rate-survey/",
        desc: "The most comprehensive annual survey of malpractice premium rates, published since 1991. Tracks base-rate premiums state-by-state and county-by-county for internal medicine, general surgery, and OB/GYN.",
        updated: "Annual (October)",
      },
      {
        name: "AMA Policy Research Perspectives — MLM Premium Analysis",
        org: "American Medical Association",
        url: "https://www.ama-assn.org/system/files/prp-mlm-premiums-2025.pdf",
        desc: "AMA analysis of Medical Liability Monitor premium data, reporting trends in malpractice insurance costs by specialty and state.",
        updated: "Annual",
      },
      {
        name: "NPDB Data Analysis Tool",
        org: "National Practitioner Data Bank, HRSA",
        url: "https://www.npdb.hrsa.gov/analysistool/",
        desc: "Customizable research datasets from medical malpractice payment reports and adverse action reports from 1990 to present. Allows analysis by practitioner type, specialty, state, and payment amount.",
        updated: "Continuous (data through Dec 2025)",
      },
      {
        name: "NPDB Public Use Data File",
        org: "National Practitioner Data Bank, HRSA",
        url: "https://www.npdb.hrsa.gov/resources/publicData.jsp",
        desc: "Downloadable de-identified data on medical malpractice payments, adverse licensure actions, and clinical privilege actions.",
        updated: "Annual refresh",
      },
      {
        name: "Diederich Healthcare — Malpractice Insurance Data",
        org: "Diederich Healthcare / Arthur J. Gallagher & Co.",
        url: "https://www.diederichhealthcare.com/",
        desc: "Malpractice claims data and premium benchmarks from one of the largest physician malpractice insurance brokers. Publishes specialty-specific claims analysis.",
        updated: "Periodic",
      },
    ],
  },
  {
    title: "AI & Automation Risk Assessment",
    emoji: "🤖",
    sources: [
      {
        name: "Frey & Osborne — The Future of Employment",
        org: "Oxford Martin School, University of Oxford",
        url: "https://www.oxfordmartin.ox.ac.uk/publications/the-future-of-employment",
        desc: "Foundational 2013 study estimating automation probability for 702 occupations, including healthcare roles. Physicians and surgeons rated at very low automation risk (~0.4%). Provides the baseline automation-risk framework adapted for our specialty assessments.",
        updated: "2013 (landmark study; cited 15,000+ times)",
      },
      {
        name: "McKinsey Global Institute — Generative AI and the Future of Work in America",
        org: "McKinsey & Company",
        url: "https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america",
        desc: "2023 analysis of how generative AI reshapes occupational demand. Projects healthcare employment to grow 17-30% by 2030, but notes AI will automate specific diagnostic and administrative tasks within physician workflows.",
        updated: "2023 (updated from 2017 'Jobs Lost, Jobs Gained')",
      },
      {
        name: "McKinsey — Transforming Healthcare with AI",
        org: "McKinsey & Company / EIT Health",
        url: "https://www.mckinsey.com/industries/healthcare/our-insights/transforming-healthcare-with-ai",
        desc: "Analysis of AI applications in clinical settings (imaging, pathology, drug discovery) and projected impact on the healthcare workforce and cost structure.",
        updated: "Periodic",
      },
      {
        name: "Brookings Institution — Automation and AI: How Machines Affect People and Places",
        org: "Brookings Metropolitan Policy Program",
        url: "https://www.brookings.edu/wp-content/uploads/2019/01/ES_2019.01_BrookingsMetro_Automation-AI_Report_Muro-Maxim-Whiton-FINAL.pdf",
        desc: "Quantifies AI exposure by occupation, geography, and demographics. Healthcare professionals sit in the medium-to-low exposure bucket. Used for our AI-disruption stress test scenarios.",
        updated: "2019; GenAI update 2023",
      },
      {
        name: "NBER — The Potential Impact of AI on Healthcare Spending",
        org: "National Bureau of Economic Research",
        url: "https://www.nber.org/system/files/working_papers/w30857/w30857.pdf",
        desc: "Harvard/McKinsey working paper estimating AI could save the U.S. healthcare system $200-360B annually, with implications for physician demand in affected subspecialties.",
        updated: "2023",
      },
    ],
  },
  {
    title: "Stress Test & Scenario Modeling",
    emoji: "🔥",
    sources: [
      {
        name: "CMS Medicare Physician Fee Schedule — Conversion Factor History",
        org: "Centers for Medicare & Medicaid Services",
        url: "https://www.cms.gov/medicare/payment/physician-fee-schedule",
        desc: "Historical and current Medicare conversion factors used to model reimbursement-cut scenarios. The CY 2026 final rule includes a 2.5% efficiency adjustment that effectively offsets pay increases for many specialties.",
        updated: "Annual",
      },
      {
        name: "KFF — How Medicare Pays Physicians",
        org: "Kaiser Family Foundation",
        url: "https://www.kff.org/medicare/what-to-know-about-how-medicare-pays-physicians/",
        desc: "Explains the Medicare physician payment system, tracks inflation-adjusted payment trends, and documents real-value erosion over time. Key context for reimbursement-cut stress tests.",
        updated: "Periodic",
      },
      {
        name: "Frey & Osborne / Brookings / McKinsey — AI Disruption Projections",
        org: "Various (see AI & Automation Risk section)",
        desc: "Combined automation probability estimates and workforce-transition projections used to model AI-disruption scenarios by specialty (radiology, pathology, dermatology image analysis, etc.).",
        updated: "See individual source entries",
      },
      {
        name: "BLS Injury and Illness Data — Healthcare Workers",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/iif/",
        desc: "Occupational injury rates for healthcare practitioners. Used for career-ending injury risk modeling in surgical specialties.",
        updated: "Annual",
      },
      {
        name: "AMA Physician Professional Data (Physician Masterfile)",
        org: "American Medical Association",
        url: "https://www.ama-assn.org/about/ama-physician-professional-data/ama-physician-professional-data",
        desc: "Education, training, and practice data on 1.5M+ physicians. Used for workforce supply projections and career-length modeling.",
        updated: "Continuous",
      },
    ],
  },
];

export default function Sources() {
  return (
    <div style={{ padding: "8px 12px" }}>
      <h2 style={styles.header}>Data Sources</h2>
      <p style={styles.subtitle}>
        References and methodology behind the numbers
      </p>

      <div
        style={{
          background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
          borderRadius: 12,
          padding: "12px 16px",
          margin: "0 4px 16px",
          border: "1px solid #c8e6c9",
          fontSize: 13,
          color: "#555",
          lineHeight: 1.5,
        }}
      >
        All data in this guide is synthesized from publicly available,
        peer-reviewed, and industry-standard sources. Salary figures represent
        U.S. national averages and may vary by region, practice setting, and
        subspecialty focus. Where multiple sources disagree, we use the median
        of reported values.
      </div>

      {SOURCE_CATEGORIES.map((cat) => (
        <div key={cat.title} style={{ margin: "0 4px 20px" }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1a1a2e",
              margin: "0 0 8px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {cat.emoji} {cat.title}
          </h3>

          {cat.sources.map((src) => (
            <div
              key={src.name}
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 8,
                border: "1px solid #e8e8e8",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#1a1a2e",
                  marginBottom: 2,
                }}
              >
                {src.url ? (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1982C4", textDecoration: "none" }}
                  >
                    {src.name} ↗
                  </a>
                ) : (
                  src.name
                )}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                {src.org} · Updated {src.updated}
              </div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.4 }}>
                {src.desc}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#aaa",
          padding: "16px 0 8px",
          borderTop: "1px solid #eee",
          margin: "0 4px",
        }}
      >
        Last methodology review: February 2026
      </div>
    </div>
  );
}
