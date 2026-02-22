// Sources.jsx — Data sources and methodology references
// Family-aware: shows healthcare and/or law sources based on active family.

import { styles } from "../styles/theme";

const HEALTHCARE_SOURCES = [
  {
    title: "Compensation Data",
    emoji: "💰",
    sources: [
      {
        name: "Medscape Physician Compensation Report",
        org: "Medscape / WebMD Health",
        url: "https://www.medscape.com/sites/public/physician-comp/2025",
        desc: "Annual survey of 10,000+ U.S. physicians covering salary by specialty, practice setting, region, and gender.",
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
        desc: "Gold-standard industry benchmark for physician and advanced-practice provider compensation, wRVU productivity, and staffing ratios.",
        updated: "Annual (May)",
      },
      {
        name: "ADA Health Policy Institute — Income from Dentistry",
        org: "American Dental Association",
        url: "https://www.ada.org/resources/research/health-policy-institute/dental-practice-research/trends-in-dentist-income",
        desc: "Net income, gross billings, and practice expense data for general dentists and specialists.",
        updated: "Annual",
      },
      {
        name: "AOA Survey of Optometric Practice",
        org: "American Optometric Association",
        url: "https://www.aoa.org/optometrists/tools-and-resources/research-and-information-center/survey-reports/survey-of-optometric-practice/income-from-optometry",
        desc: "Net income data for optometrists by practice mode, years in practice, and geographic region.",
        updated: "Periodic",
      },
      {
        name: "BLS Occupational Outlook Handbook — Healthcare",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/ooh/healthcare/",
        desc: "Median annual wages, employment projections, and job outlook for physicians, dentists, podiatrists, and optometrists.",
        updated: "Annual (September)",
      },
      {
        name: "BLS Occupational Employment and Wage Statistics (OEWS)",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/oes/",
        desc: "Detailed wage percentiles (10th, 25th, median, 75th, 90th) by detailed occupation code and metropolitan area.",
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
        desc: "Official match statistics: total applicants, positions offered, fill rates, and match rates broken down by specialty and applicant type.",
        updated: "Annual (May)",
      },
      {
        name: "Charting Outcomes in the Match",
        org: "National Resident Matching Program",
        url: "https://www.nrmp.org/match-data/2025/07/charting-outcomes-applicant-survey-results-2025-main-residency-match/",
        desc: "Applicant characteristics of matched vs. unmatched applicants by specialty. Key source for competitiveness metrics.",
        updated: "Annual (July)",
      },
      {
        name: "ACGME Common Program Requirements",
        org: "Accreditation Council for Graduate Medical Education",
        url: "https://www.acgme.org/programs-and-institutions/programs/common-program-requirements/",
        desc: "Residency and fellowship program requirements, training duration by specialty, duty-hour limits (80 hr/wk cap).",
        updated: "Continuous",
      },
      {
        name: "AAMC Report on Residents",
        org: "Association of American Medical Colleges",
        url: "https://www.aamc.org/data-reports/students-residents/data/report-residents/2023/executive-summary",
        desc: "Graduate medical education data including number of residents and fellows by specialty, training duration, and demographics.",
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
        desc: "Burnout rates, depression prevalence, happiness levels, and coping strategies surveyed across 15+ specialties.",
        updated: "Annual",
      },
      {
        name: "AMA National Physician Burnout Survey",
        org: "American Medical Association",
        url: "https://www.ama-assn.org/practice-management/physician-health/national-physician-burnout-survey",
        desc: "Longitudinal burnout tracking using validated Maslach Burnout Inventory. Published in Mayo Clinic Proceedings.",
        updated: "Annual/Biennial",
      },
    ],
  },
  {
    title: "Malpractice & Liability",
    emoji: "🛡️",
    sources: [
      {
        name: "Medical Liability Monitor — Annual Rate Survey",
        org: "Medical Liability Monitor",
        url: "https://medicalliabilitymonitor.com/rate-survey/",
        desc: "The most comprehensive annual survey of malpractice premium rates. Tracks base-rate premiums state-by-state for multiple specialties.",
        updated: "Annual (October)",
      },
      {
        name: "NPDB Data Analysis Tool",
        org: "National Practitioner Data Bank, HRSA",
        url: "https://www.npdb.hrsa.gov/analysistool/",
        desc: "Customizable research datasets from medical malpractice payment reports and adverse action reports from 1990 to present.",
        updated: "Continuous",
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
        desc: "Medical school tuition, fees, and health insurance costs broken down by public/private and in-state/out-of-state.",
        updated: "Annual",
      },
      {
        name: "AAMC Physician Education Debt and Cost",
        org: "Association of American Medical Colleges",
        url: "https://www.aamc.org/data-reports/students-residents/report/physician-education-debt-and-cost-attend-medical-school",
        desc: "Average debt at graduation (~$200K+ for MD students), repayment projections, and cost-of-attendance trends.",
        updated: "Annual",
      },
      {
        name: "Federal Student Aid — Loan Interest Rates",
        org: "U.S. Department of Education",
        url: "https://studentaid.gov/understand-aid/types/loans/interest-rates",
        desc: "Current federal student loan interest rates for graduate/professional students.",
        updated: "Annual (July 1 reset)",
      },
    ],
  },
];

const LAW_SOURCES = [
  {
    title: "Compensation Data",
    emoji: "💰",
    sources: [
      {
        name: "NALP — Jobs & JDs: Employment and Salaries of New Law Graduates",
        org: "National Association for Law Placement",
        url: "https://www.nalp.org/research-and-data/jobs-jds/",
        desc: "The gold-standard source for entry-level attorney compensation. Tracks salary distribution by employer type (BigLaw, government, public interest), region, and law school ranking.",
        updated: "Annual (July)",
      },
      {
        name: "BLS Occupational Outlook Handbook — Legal Occupations",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/ooh/legal/",
        desc: "Median wages, employment projections, and job outlook for lawyers, judges, paralegals, and legal support roles.",
        updated: "Annual (September)",
      },
      {
        name: "Robert Half — Legal Salary Guide",
        org: "Robert Half International",
        url: "https://www.roberthalf.com/us/en/insights/salary-guide/legal",
        desc: "Salary ranges for attorneys and legal staff by practice area, firm size, years of experience, and metro area.",
        updated: "Annual",
      },
      {
        name: "Am Law 100 / Am Law 200 Rankings",
        org: "The American Lawyer (ALM Media)",
        url: "https://www.law.com/americanlawyer/rankings/the-2025-am-law-100/",
        desc: "Revenue, profit per partner (PPP), revenue per lawyer, and associate compensation at the top 100/200 law firms. Primary source for Big Law economics.",
        updated: "Annual (May)",
      },
      {
        name: "Cravath Scale / BigLaw Salary Tracker",
        org: "Various (Above the Law, BigLaw Investor)",
        desc: "Tracks the lockstep associate salary scale originated by Cravath, Swaine & Moore. Currently $225K base for first-year associates at market-rate firms.",
        updated: "Updated when scale changes",
      },
      {
        name: "BLS Occupational Employment and Wage Statistics (OEWS) — Legal",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/oes/current/oes230000.htm",
        desc: "Detailed wage percentiles for lawyers (23-1011), judges (23-1020), paralegals (23-2011), and other legal occupations by metro area.",
        updated: "Annual (March)",
      },
    ],
  },
  {
    title: "Law School & Admissions",
    emoji: "🎓",
    sources: [
      {
        name: "ABA — Required Disclosures (Standard 509)",
        org: "American Bar Association Section of Legal Education",
        url: "https://www.abarequireddisclosures.org/",
        desc: "Official data from every ABA-accredited law school: LSAT/GPA profiles, acceptance rates, tuition, bar passage, employment outcomes.",
        updated: "Annual",
      },
      {
        name: "LSAC Volume Summary — Applicants, Admitted, Matriculants",
        org: "Law School Admission Council",
        url: "https://www.lsac.org/data-research/data",
        desc: "National and school-level data on law school applicant volume, LSAT score distributions, and enrollment trends.",
        updated: "Annual / Monthly cycle updates",
      },
      {
        name: "U.S. News Best Law Schools Rankings",
        org: "U.S. News & World Report",
        url: "https://www.usnews.com/best-graduate-schools/top-law-schools/law-rankings",
        desc: "Widely referenced law school rankings incorporating employment outcomes, bar passage, selectivity, and peer reputation.",
        updated: "Annual (March)",
      },
    ],
  },
  {
    title: "Employment & Job Market",
    emoji: "📋",
    sources: [
      {
        name: "NALP — Employment Outcomes Data",
        org: "National Association for Law Placement",
        url: "https://www.nalp.org/research-and-data/",
        desc: "Employment status, employer type, salary, bar passage, and job location for each graduating class, 10 months post-graduation.",
        updated: "Annual",
      },
      {
        name: "ABA National Lawyer Population Survey",
        org: "American Bar Association",
        url: "https://www.americanbar.org/about_the_aba/profession_statistics/",
        desc: "Total licensed attorney count by state, growth trends, and active vs. inactive status. ~1.3M active attorneys nationwide.",
        updated: "Annual",
      },
      {
        name: "BLS Employment Projections — Legal Occupations",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/emp/tables/emp-by-detailed-occupation.htm",
        desc: "10-year employment projections for lawyers, judges, and legal support roles. Projects 5% growth for lawyers 2022-2032.",
        updated: "Biennial",
      },
    ],
  },
  {
    title: "Work-Life Balance & Satisfaction",
    emoji: "⚖️",
    sources: [
      {
        name: "ABA Profile of the Legal Profession",
        org: "American Bar Association",
        url: "https://www.americanbar.org/news/reporter_resources/profile-of-profession/",
        desc: "Comprehensive look at the legal profession including demographics, well-being, practice areas, pro bono work, and diversity trends.",
        updated: "Annual",
      },
      {
        name: "ALM Intelligence — Law Department Survey",
        org: "ALM Media (The American Lawyer)",
        url: "https://www.law.com/americanlawyer/",
        desc: "Associate satisfaction surveys, midlevel associate surveys, and Am Law workplace culture rankings.",
        updated: "Annual",
      },
      {
        name: "ABA / Hazelden Betty Ford — Attorney Well-Being Study",
        org: "ABA Commission on Lawyer Assistance Programs",
        url: "https://www.americanbar.org/groups/lawyer_assistance/",
        desc: "Landmark 2016 study of 12,825 lawyers finding 28% depression, 19% anxiety, 20.6% problematic drinking. Updated well-being initiatives tracked annually.",
        updated: "2016 study; ongoing initiatives",
      },
    ],
  },
  {
    title: "Financial Modeling",
    emoji: "📊",
    sources: [
      {
        name: "ABA — Law School Tuition and Fees",
        org: "American Bar Association",
        url: "https://www.americanbar.org/groups/legal_education/resources/statistics/",
        desc: "Law school tuition data for all ABA-accredited schools. Average: ~$53K/yr private, ~$30K/yr public in-state.",
        updated: "Annual",
      },
      {
        name: "EducationData.org — Average Law School Debt",
        org: "EducationData.org",
        url: "https://educationdata.org/average-law-school-debt",
        desc: "Aggregated law school debt statistics. Average JD graduate debt ~$165K; T14 can exceed $200K.",
        updated: "Continuous",
      },
      {
        name: "Federal Student Aid — Loan Interest Rates",
        org: "U.S. Department of Education",
        url: "https://studentaid.gov/understand-aid/types/loans/interest-rates",
        desc: "Current federal student loan interest rates for graduate/professional students.",
        updated: "Annual (July 1 reset)",
      },
    ],
  },
  {
    title: "AI & Future of Legal Practice",
    emoji: "🤖",
    sources: [
      {
        name: "Thomson Reuters — Future of Professionals Report",
        org: "Thomson Reuters Institute",
        url: "https://www.thomsonreuters.com/en/institute.html",
        desc: "Annual survey of legal professionals on AI adoption, time savings, and impact on billing models and staffing.",
        updated: "Annual",
      },
      {
        name: "McKinsey — Generative AI and the Future of Work in America",
        org: "McKinsey & Company",
        url: "https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america",
        desc: "Analysis of how generative AI reshapes occupational demand including legal services. Legal ranked among top industries for AI impact.",
        updated: "2023",
      },
      {
        name: "Goldman Sachs — The Potentially Large Effects of AI on Economic Growth",
        org: "Goldman Sachs Research",
        desc: "Estimates 44% of legal tasks could be automated by AI — the highest of any profession studied. Widely cited in legal industry analysis.",
        updated: "2023",
      },
    ],
  },
];

const ENGINEERING_SOURCES = [
  {
    title: "Compensation Data",
    emoji: "💰",
    sources: [
      {
        name: "BLS Occupational Outlook Handbook — Engineering",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/ooh/architecture-and-engineering/",
        desc: "Median wages, employment projections, and job outlook for all engineering disciplines.",
        updated: "Annual (September)",
      },
      {
        name: "BLS Occupational Employment and Wage Statistics (OEWS)",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/oes/",
        desc: "Detailed wage percentiles by engineering occupation code and metropolitan area.",
        updated: "Annual (March)",
      },
      {
        name: "Levels.fyi — Engineering Compensation",
        org: "Levels.fyi",
        url: "https://www.levels.fyi/",
        desc: "Crowdsourced total compensation data for software and hardware engineers at major tech companies.",
        updated: "Continuous",
      },
      {
        name: "IEEE-USA Salary & Benefits Survey",
        org: "IEEE-USA",
        url: "https://ieeeusa.org/careers/salary-survey/",
        desc: "Annual survey of IEEE members covering salary by discipline, degree level, years of experience, and industry.",
        updated: "Annual",
      },
    ],
  },
  {
    title: "Education & Training",
    emoji: "🎓",
    sources: [
      {
        name: "ASEE Engineering by the Numbers",
        org: "American Society for Engineering Education",
        url: "https://www.asee.org/papers-and-publications/publications/college-profiles",
        desc: "Bachelor's, master's, and doctoral degrees awarded by engineering discipline. Enrollment, demographics, and institutional data.",
        updated: "Annual",
      },
      {
        name: "NSF Survey of Earned Doctorates",
        org: "National Science Foundation",
        url: "https://ncses.nsf.gov/surveys/earned-doctorates/",
        desc: "Comprehensive data on PhD recipients including field, funding, time-to-degree, and post-graduation plans.",
        updated: "Annual",
      },
    ],
  },
  {
    title: "Job Market & Industry Trends",
    emoji: "📋",
    sources: [
      {
        name: "BLS Employment Projections — Engineering",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/emp/tables/emp-by-detailed-occupation.htm",
        desc: "10-year employment projections for all engineering occupations.",
        updated: "Biennial",
      },
      {
        name: "Robert Half — Technology & Engineering Salary Guide",
        org: "Robert Half International",
        url: "https://www.roberthalf.com/us/en/insights/salary-guide/technology",
        desc: "Salary ranges for engineering and technology roles by specialization and experience level.",
        updated: "Annual",
      },
    ],
  },
];

const BUSINESS_SOURCES = [
  {
    title: "Compensation Data",
    emoji: "💰",
    sources: [
      {
        name: "BLS Occupational Outlook Handbook — Business & Financial",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/ooh/business-and-financial/",
        desc: "Median wages, employment projections, and job outlook for management, business, and financial occupations.",
        updated: "Annual (September)",
      },
      {
        name: "Robert Half — Salary Guide",
        org: "Robert Half International",
        url: "https://www.roberthalf.com/us/en/insights/salary-guide",
        desc: "Salary ranges for finance, accounting, marketing, and operations roles by experience level, company size, and metro area.",
        updated: "Annual",
      },
      {
        name: "Glassdoor — Salary Explorer",
        org: "Glassdoor / Indeed",
        url: "https://www.glassdoor.com/Salaries/",
        desc: "Crowdsourced salary data for business roles including base pay, bonuses, and total compensation by company and location.",
        updated: "Continuous",
      },
      {
        name: "Wall Street Oasis — Compensation Reports",
        org: "Wall Street Oasis",
        url: "https://www.wallstreetoasis.com/resources/compensation",
        desc: "Detailed compensation data for investment banking, private equity, hedge funds, and consulting from verified professionals.",
        updated: "Continuous",
      },
    ],
  },
  {
    title: "Education & Admissions",
    emoji: "🎓",
    sources: [
      {
        name: "GMAC — Application Trends Survey",
        org: "Graduate Management Admission Council",
        url: "https://www.gmac.com/market-intelligence-and-research/research-library/admissions-and-application-trends",
        desc: "MBA application volume, GMAT/GRE scores, acceptance rates, and enrollment trends across global business schools.",
        updated: "Annual",
      },
      {
        name: "U.S. News Best Business Schools Rankings",
        org: "U.S. News & World Report",
        url: "https://www.usnews.com/best-graduate-schools/top-business-schools/mba-rankings",
        desc: "MBA program rankings incorporating employment outcomes, GMAT scores, starting salary, and recruiter assessments.",
        updated: "Annual (March)",
      },
      {
        name: "AICPA — CPA Exam Statistics",
        org: "American Institute of Certified Public Accountants",
        url: "https://www.aicpa-cima.com/resources/landing/cpa-exam-scoring-and-pass-rates",
        desc: "CPA exam pass rates by section, candidate demographics, and trends. Average cumulative pass rate ~50% per section.",
        updated: "Quarterly",
      },
      {
        name: "CFA Institute — CFA Exam Results",
        org: "CFA Institute",
        url: "https://www.cfainstitute.org/programs/cfa/exam/results-and-pass-rates",
        desc: "CFA exam pass rates by level (~40% Level I, ~45% Level II, ~50% Level III). Candidate demographics and registration trends.",
        updated: "Per exam window",
      },
    ],
  },
  {
    title: "Job Market & Industry",
    emoji: "📋",
    sources: [
      {
        name: "BLS Employment Projections — Business & Financial",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/emp/tables/emp-by-detailed-occupation.htm",
        desc: "10-year employment projections for management, business, and financial occupations.",
        updated: "Biennial",
      },
      {
        name: "McKinsey Global Institute — Future of Work",
        org: "McKinsey & Company",
        url: "https://www.mckinsey.com/mgi/our-research",
        desc: "Research on how automation, AI, and shifting business models affect demand for business professionals across industries.",
        updated: "Ongoing",
      },
    ],
  },
  {
    title: "Work-Life Balance & Satisfaction",
    emoji: "⚖️",
    sources: [
      {
        name: "Deloitte — Workplace Burnout Survey",
        org: "Deloitte",
        url: "https://www2.deloitte.com/us/en/pages/about-deloitte/articles/burnout-survey.html",
        desc: "Burnout prevalence and workplace satisfaction across business and professional services roles.",
        updated: "Annual",
      },
      {
        name: "Gallup — State of the Global Workplace",
        org: "Gallup",
        url: "https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx",
        desc: "Employee engagement, well-being, and workplace satisfaction data across industries and job functions.",
        updated: "Annual",
      },
    ],
  },
  {
    title: "Financial Modeling",
    emoji: "📊",
    sources: [
      {
        name: "EducationData.org — Average Cost of an MBA",
        org: "EducationData.org",
        url: "https://educationdata.org/average-cost-of-an-mba",
        desc: "MBA tuition, fees, and total cost of attendance data. Average ~$75K/yr at top programs, $120K+ total debt.",
        updated: "Continuous",
      },
      {
        name: "Federal Student Aid — Loan Interest Rates",
        org: "U.S. Department of Education",
        url: "https://studentaid.gov/understand-aid/types/loans/interest-rates",
        desc: "Current federal student loan interest rates for graduate and professional students.",
        updated: "Annual (July 1 reset)",
      },
      {
        name: "NCES — Digest of Education Statistics",
        org: "National Center for Education Statistics",
        url: "https://nces.ed.gov/programs/digest/",
        desc: "Comprehensive statistics on undergraduate degrees awarded by field, including business administration.",
        updated: "Annual",
      },
    ],
  },
];

const GOVERNMENT_SOURCES = [
  {
    title: "Compensation Data",
    emoji: "💰",
    sources: [
      {
        name: "BLS Occupational Outlook Handbook — Protective Service",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/ooh/protective-service/",
        desc: "Median wages, employment projections, and job outlook for police, firefighters, corrections officers, and other protective service occupations.",
        updated: "Annual (September)",
      },
      {
        name: "Military Pay Charts — Defense Finance and Accounting Service",
        org: "U.S. Department of Defense",
        url: "https://www.dfas.mil/militarymembers/payentitlements/Pay-Tables/",
        desc: "Official military base pay tables by rank and years of service, plus BAH, BAS, and special pay rates.",
        updated: "Annual (January)",
      },
      {
        name: "OPM Federal Pay Tables (GS Scale)",
        org: "U.S. Office of Personnel Management",
        url: "https://www.opm.gov/policy-data-oversight/pay-leave/salaries-wages/",
        desc: "General Schedule pay tables with locality adjustments for all federal civilian employees across 53 locality areas.",
        updated: "Annual (January)",
      },
      {
        name: "FederalPay.org — Federal Employee Salary Database",
        org: "FederalPay.org",
        url: "https://www.federalpay.org/",
        desc: "Searchable database of federal employee salaries by agency, job title, and location. Includes GS, SES, and military pay data.",
        updated: "Continuous",
      },
    ],
  },
  {
    title: "Military & Academy Training",
    emoji: "🎓",
    sources: [
      {
        name: "DoD Active Duty Demographics Report",
        org: "U.S. Department of Defense",
        url: "https://www.militaryonesource.mil/data-research-and-statistics/military-community-demographics/",
        desc: "Active duty force size, branch composition, demographics, retention rates, and recruitment statistics.",
        updated: "Annual",
      },
      {
        name: "FBI Careers — Special Agent Selection Process",
        org: "Federal Bureau of Investigation",
        url: "https://www.fbi.gov/careers/special-agents",
        desc: "FBI Special Agent application requirements, Phase 1/2 testing, Quantico training, and acceptance rates (~5%).",
        updated: "Continuous",
      },
      {
        name: "State Department — Foreign Service Officer Test (FSOT)",
        org: "U.S. Department of State",
        url: "https://careers.state.gov/career-paths/foreign-service/",
        desc: "FSOT pass rates (~30% written, ~3% overall), oral assessment process, career tracks, and language requirements.",
        updated: "Per exam cycle",
      },
      {
        name: "FLETC — Federal Law Enforcement Training Centers",
        org: "U.S. Department of Homeland Security",
        url: "https://www.fletc.gov/",
        desc: "Training programs for 90+ federal agencies including CBP, ICE, Secret Service, ATF. Training duration, curriculum, and graduation rates.",
        updated: "Continuous",
      },
    ],
  },
  {
    title: "Job Market & Demand",
    emoji: "📋",
    sources: [
      {
        name: "BLS Employment Projections — Protective Service",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/emp/tables/emp-by-detailed-occupation.htm",
        desc: "10-year employment projections for police, fire, corrections, and other protective service occupations.",
        updated: "Biennial",
      },
      {
        name: "USAJobs — Federal Workforce Data",
        org: "U.S. Office of Personnel Management",
        url: "https://www.usajobs.gov/",
        desc: "Federal job postings, hiring trends, and workforce statistics across all government agencies.",
        updated: "Continuous",
      },
    ],
  },
  {
    title: "Work-Life Balance & Satisfaction",
    emoji: "⚖️",
    sources: [
      {
        name: "Federal Employee Viewpoint Survey (FEVS)",
        org: "U.S. Office of Personnel Management",
        url: "https://www.opm.gov/fevs/",
        desc: "Annual survey of federal employee engagement, satisfaction, and workplace conditions across all agencies. ~600K respondents.",
        updated: "Annual",
      },
      {
        name: "SAMHSA — First Responder Mental Health",
        org: "Substance Abuse and Mental Health Services Administration",
        url: "https://www.samhsa.gov/dtac/disaster-responders",
        desc: "Data on PTSD, burnout, and mental health outcomes for first responders including firefighters, EMS, and law enforcement.",
        updated: "Ongoing",
      },
      {
        name: "RAND — Military Quality of Life Research",
        org: "RAND Corporation",
        url: "https://www.rand.org/topics/military-personnel.html",
        desc: "Research on military retention, family life, deployment stress, transition to civilian careers, and veteran outcomes.",
        updated: "Ongoing",
      },
    ],
  },
  {
    title: "Financial Modeling",
    emoji: "📊",
    sources: [
      {
        name: "Military Compensation Calculator",
        org: "U.S. Department of Defense",
        url: "https://militarypay.defense.gov/calculators/",
        desc: "Official calculator for total military compensation including base pay, BAH, BAS, tax advantages, and retirement benefits.",
        updated: "Annual",
      },
      {
        name: "Federal Student Aid — Public Service Loan Forgiveness",
        org: "U.S. Department of Education",
        url: "https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service",
        desc: "PSLF program details for government employees — loan forgiveness after 120 qualifying payments (10 years of service).",
        updated: "Continuous",
      },
      {
        name: "TSP — Thrift Savings Plan",
        org: "Federal Retirement Thrift Investment Board",
        url: "https://www.tsp.gov/",
        desc: "Federal employee retirement savings plan. Government matches up to 5% of pay. Used to model long-term wealth building.",
        updated: "Continuous",
      },
    ],
  },
];

const SHARED_SOURCES = [
  {
    title: "Stress Test & Scenario Modeling",
    emoji: "🔥",
    sources: [
      {
        name: "Frey & Osborne — The Future of Employment",
        org: "Oxford Martin School, University of Oxford",
        url: "https://www.oxfordmartin.ox.ac.uk/publications/the-future-of-employment",
        desc: "Foundational 2013 study estimating automation probability for 702 occupations. Provides the baseline automation-risk framework.",
        updated: "2013 (landmark study)",
      },
      {
        name: "Brookings Institution — Automation and AI",
        org: "Brookings Metropolitan Policy Program",
        url: "https://www.brookings.edu/articles/automation-and-artificial-intelligence-how-machines-affect-people-and-places/",
        desc: "Quantifies AI exposure by occupation, geography, and demographics. Used for AI-disruption stress test scenarios.",
        updated: "2019; GenAI update 2023",
      },
      {
        name: "BLS Consumer Expenditure Surveys",
        org: "U.S. Bureau of Labor Statistics",
        url: "https://www.bls.gov/cex/",
        desc: "Living expense benchmarks used to model post-training disposable income and savings rate in the financial model.",
        updated: "Annual",
      },
    ],
  },
];

function getSourcesForFamily(familySlug) {
  if (familySlug === "healthcare") return [...HEALTHCARE_SOURCES, ...SHARED_SOURCES];
  if (familySlug === "law") return [...LAW_SOURCES, ...SHARED_SOURCES];
  if (familySlug === "engineering") return [...ENGINEERING_SOURCES, ...SHARED_SOURCES];
  if (familySlug === "business") return [...BUSINESS_SOURCES, ...SHARED_SOURCES];
  if (familySlug === "government") return [...GOVERNMENT_SOURCES, ...SHARED_SOURCES];
  return [...HEALTHCARE_SOURCES, ...LAW_SOURCES, ...ENGINEERING_SOURCES, ...BUSINESS_SOURCES, ...GOVERNMENT_SOURCES, ...SHARED_SOURCES];
}

export default function Sources({ familySlug }) {
  const categories = getSourcesForFamily(familySlug);

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
        specialization. Where multiple sources disagree, we use the median
        of reported values.
      </div>

      {categories.map((cat) => (
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
