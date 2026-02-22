"""
stress.py — stress test functions for crossrd pipeline

derives stress test resilience scores from raw specialty data.
each career is scored 1-10 (10 = most resilient) against 4 risk scenarios.
"""


SCENARIOS = [
    {"id": "ai", "name": "AI Disruption Accelerates"},
    {"id": "pay", "name": "Reimbursement Cuts 20%"},
    {"id": "injury", "name": "Career-Ending Injury at 40"},
    {"id": "match", "name": "Failure to Match"},
]

# profession-level base resilience for "failure to match" scenario
# MD/DO: very competitive match = devastating to fail
# DDS/DMD: moderately competitive
# DPM: easy match = high resilience
# OD: no formal match = high resilience
MATCH_RESILIENCE_BY_PROFESSION = {
    "MD/DO": 3,
    "DDS/DMD": 7,
    "DPM": 9,
    "OD": 8,
    # law professions
    "JD": 4,
    "JD+Patent": 6,
    "Paralegal": 8,
    "Judge": 2,
    # engineering professions
    "BS": 7,
    "MS": 6,
    "PhD": 4,
    # business professions
    "BBA": 8,
    "MBA": 5,
    "CPA-CFA": 7,
    # government professions
    "Academy": 8,
    "BA": 5,
    "MA+": 4,
    # trades professions
    "Trade School": 8,
    "Apprenticeship": 6,
    "Contractor": 4,
    # education professions
    "Teaching Cert": 8,
    "M.Ed": 5,
    "Research PhD": 3,
    "Applied Science": 6,
    # AI & future professions
    "AI Engineer": 7,
    "AI Scientist": 4,
    "AI Creative": 5,
    "AI Strategist": 6,
}


def derive_stress_scores(spec, profession=None):
    """Derive stress test resilience scores from raw specialty data.

    Maps raw specialty fields to 4 stress scenarios:
      ai:     automationRisk (inverted) and handsOnInsulation
      pay:    demand/geographic flexibility + satisfaction (resilience to pay cuts)
      injury: procedureMix (inverted: more procedures = less resilient) + partTimeFlex
      match:  profession-level base + matchComp adjustment

    Returns dict: {"ai": 7, "pay": 5, "injury": 6, "match": 8}
    """
    prof = profession or spec.get("profession", "MD/DO")

    def clamp(v):
        return max(1, min(10, round(v)))

    # AI scenario: hands-on work insulates, automation risk hurts
    auto_risk = spec.get("automationRisk", 5)
    hands_on = spec.get("handsOnInsulation", 5)
    ai = clamp((hands_on + (11 - auto_risk)) / 2)

    # Pay cut scenario: geographic flexibility + demand = can move for better pay;
    # satisfaction = stays in career despite pay cut; low admin burden = less overhead
    geo = spec.get("geographicFlex", 5)
    sat = spec.get("satisfaction", 70)
    sat_score = clamp(1 + (sat - 50) / (95 - 50) * 9) if sat else 5
    admin = spec.get("adminBurden", 5)
    pay = clamp(geo * 0.4 + sat_score * 0.3 + (11 - admin) * 0.3)

    # Injury scenario: high procedureMix = surgical/hands-on = vulnerable;
    # partTimeFlex helps (can reduce load); careerLongevity indicates adaptability
    proc_mix = spec.get("procedureMix", 5)
    pt_flex = spec.get("partTimeFlex", 5)
    longevity = spec.get("careerLongevity", 5)
    # procedureMix 10 = very procedural = very vulnerable to injury
    injury = clamp(((11 - proc_mix) * 0.5 + pt_flex * 0.25 + longevity * 0.25))

    # Match scenario: profession-level base with specialty adjustment
    # matchComp scale: 10 = most competitive (hardest to match)
    base_match = MATCH_RESILIENCE_BY_PROFESSION.get(prof, 5)
    match_comp = spec.get("matchComp", 5)
    # within a profession, more competitive specialty = slightly lower resilience
    match = clamp(base_match - (match_comp - 5) * 0.3)

    return {"ai": ai, "pay": pay, "injury": injury, "match": match}
