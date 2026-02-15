# config.py — shared constants for the crossrd data pipeline
# these match the design system in the react frontend

# the 14 scoring categories and their default weights
CATEGORIES = [
    {"id": 1, "name": "Pre-Professional Phase", "weight": 7, "description": "How hard is it to start?"},
    {"id": 2, "name": "Admissions Competitiveness", "weight": 7, "description": "Can you realistically get in?"},
    {"id": 3, "name": "Professional School", "weight": 5, "description": "What's the school experience like?"},
    {"id": 4, "name": "Post-Graduate Training", "weight": 8, "description": "How long/hard is the road after school?"},
    {"id": 5, "name": "Financial Picture", "weight": 10, "description": "Cost, debt, time to financial freedom"},
    {"id": 6, "name": "Scope of Practice & Autonomy", "weight": 8, "description": "What can you do independently?"},
    {"id": 7, "name": "Career Economics", "weight": 12, "description": "How much do you earn over a career?"},
    {"id": 8, "name": "Daily Life & Practice Reality", "weight": 8, "description": "What does the work feel like?"},
    {"id": 9, "name": "Lifestyle & Work-Life Balance", "weight": 10, "description": "Can you have a life outside work?"},
    {"id": 10, "name": "Job Market & Demand", "weight": 5, "description": "Will you find work?"},
    {"id": 11, "name": "AI Revolution Impact", "weight": 7, "description": "How future-proof is this career?"},
    {"id": 12, "name": "Professional Satisfaction", "weight": 8, "description": "Will you enjoy this long-term?"},
    {"id": 13, "name": "Demographics & Culture", "weight": 3, "description": "Culture fit?"},
    {"id": 14, "name": "Risk Factors & Downsides", "weight": 5, "description": "Hidden costs and dangers"},
]

# profession info and colors
PROFESSIONS = {
    "MD/DO": {"label": "Medical Doctor", "color": "#E55934"},
    "DDS/DMD": {"label": "Dentist", "color": "#1982C4"},
    "DPM": {"label": "Foot Doctor", "color": "#8AC926"},
    "OD": {"label": "Eye Doctor (Optom.)", "color": "#6A4C93"},
}

# the 6 finalist careers
FINALISTS = {
    "Mohs Surgery (Dermatology)": {
        "key": "mohs", "teen_name": "Skin Cancer Surgeon",
        "color": "#D4A537", "jsx_name": "Mohs Surgery",
    },
    "Dermatology (General/Medical)": {
        "key": "derm", "teen_name": "Skin Doctor",
        "color": "#E8685E", "jsx_name": "Gen. Dermatology",
    },
    "Ophthalmology": {
        "key": "eye", "teen_name": "Eye Surgeon",
        "color": "#2BA5B5", "jsx_name": "Ophthalmology",
    },
    "Podiatric Surgery (Foot & Ankle)": {
        "key": "pod", "teen_name": "Foot & Ankle Surgeon",
        "color": "#2D3A6E", "jsx_name": "Podiatric Surgery",
    },
    "Sports Medicine / Biomechanics": {
        "key": "sport", "teen_name": "Sports Foot Doctor",
        "color": "#3EA66B", "jsx_name": "Sports Med / Biomech",
    },
    "Wound Care / Diabetic Limb Salvage": {
        "key": "wound", "teen_name": "Wound Healing Doctor",
        "color": "#8B6CAE", "jsx_name": "Wound Care / DLS",
    },
}

# mapping from excel sheet column index (0-based) to our field names
# row 3 in each L2 Matrix sheet has the headers, data starts at row 5
L2_COLUMNS = {
    0: "name",                  # Specialty / Track
    1: "residencyYears",        # Residency Duration (yrs)
    3: "matchComp",             # Match Competitiveness (1-10)
    4: "startSalary",           # Starting Salary ($K)
    5: "midSalary",             # Mid-Career Salary ($K)
    6: "peakSalary",            # Peak Earning Potential ($K)
    9: "partTimeFlex",          # Part-Time Flex (1-10)
    12: "procedureMix",         # Procedure Mix (1-10)
    13: "callSchedule",         # Call Schedule (1-10)
    14: "adminBurden",          # Admin Burden (1-10)
    16: "hoursWeek",            # Avg Hours / Week
    17: "burnout",              # Burnout Rate (%)
    18: "partTimeFeasibility",  # Part-Time Feasibility (1-10)
    19: "vacation",             # Vacation (wks/yr)
    20: "careerLongevity",      # Career Longevity (1-10)
    21: "malpracticeFreq",      # Malpractice Frequency (1-10)
    22: "malpracticeCost",      # Malpractice Cost ($K/yr)
    23: "geographicFlex",       # Geographic Flex (1-10)
    26: "automationRisk",       # Automation Risk (1-10)
    27: "handsOnInsulation",    # Hands-On Insulation (1-10)
    28: "satisfaction",         # Career Satisfaction (%)
    29: "chooseAgain",          # Choose Again (%)
    30: "intellectualStim",     # Intellectual Stimulation (1-10)
    31: "varietyRepetition",    # Variety vs Repetition (1-10)
    32: "patientImpact",        # Patient Impact (1-10)
    34: "physicalToll",         # Physical Toll (1-10)
    35: "emotionalToll",        # Emotional Toll (1-10)
    36: "malpracticeLiability", # Malpractice Liability (1-10)
    37: "injuryCareerRisk",     # Injury Career Risk (1-10)
}

# the L2 Matrix sheet names in the workbook
L2_SHEETS = {
    "MD/DO": "L2 Matrix — MD-DO",
    "DDS/DMD": "L2 Matrix — DDS-DMD",
    "DPM": "L2 Matrix — DPM",
    "OD": "L2 Matrix — OD",
}

# finalist keys in the order they appear in Career Life Models columns
FINALIST_ORDER = ["mohs", "derm", "eye", "pod", "sport", "wound"]

# the 6 scenario profile names
SCENARIO_NAMES = [
    "default", "equal_weight", "max_earnings",
    "best_lifestyle", "fastest_to_practice", "most_procedural",
]

# the 6 radar chart dimensions (consolidated from 14 categories)
RADAR_DIMENSIONS = [
    {"dim": "Money", "emoji": "💰"},
    {"dim": "Happiness", "emoji": "😊"},
    {"dim": "Free Time", "emoji": "⏰"},
    {"dim": "Hard to Get In", "emoji": "🎯"},
    {"dim": "Robot-Proof", "emoji": "🤖"},
    {"dim": "Safety Net", "emoji": "🛡️"},
]

# final ranking with verdicts
FINAL_RANKING = [
    {"rank": 1, "track": "General Dermatology", "key": "derm", "note": "Best risk-adjusted choice"},
    {"rank": 2, "track": "Mohs Surgery", "key": "mohs", "note": "Highest earnings overall"},
    {"rank": 3, "track": "Ophthalmology", "key": "eye", "note": "Most realistic MD path"},
    {"rank": 4, "track": "Podiatric Surgery", "key": "pod", "note": "Best guaranteed surgical path"},
    {"rank": 5, "track": "Wound Care / DLS", "key": "wound", "note": "Highest job demand growth"},
    {"rank": 6, "track": "Sports Med/Biomech", "key": "sport", "note": "Best work-life balance (DPM)"},
]

# decision tree structure
DECISION_TREE = {
    "q": "Are you OK with 12+ years of school and training?",
    "yes": {
        "q": "Are you a top student who can handle fierce competition?",
        "yes": {
            "q": "Same procedure all day, or many different problems?",
            "procedural": "mohs",
            "variety": "derm",
        },
        "no": "eye",
    },
    "no": {
        "q": "What matters most to you?",
        "options": [
            {"label": "💪 Highest pay & surgery", "result": "pod"},
            {"label": "🌿 Best lifestyle", "result": "sport"},
            {"label": "🔒 Job security", "result": "wound"},
        ],
    },
}
