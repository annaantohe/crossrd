"""
financial.py — financial model and timeline functions for crossrd pipeline

computes net worth trajectory from financial assumptions,
builds the money scoreboard data, and derives training timelines.
"""

from scoring import _parse_numeric


# profession-level defaults for financial parameters
# extracted from the original 6 finalist params (known-good values)
PROFESSION_DEFAULTS = {
    "MD/DO": {
        "undergrad_cost_per_yr": 35,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 60,
        "prof_school_years": 4,
        "trainee_salary": 65,
        "education_debt": 380,
        "loan_rate": 6.5,
        "living_expenses": 50,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 5,
        "salary_growth_to_mid": 3,
        "salary_growth_to_peak": 2.5,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    "DDS/DMD": {
        "undergrad_cost_per_yr": 35,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 55,
        "prof_school_years": 4,
        "trainee_salary": 60,
        "education_debt": 300,
        "loan_rate": 6.5,
        "living_expenses": 48,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 8,
        "salary_growth_to_mid": 3,
        "salary_growth_to_peak": 2.5,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    "DPM": {
        "undergrad_cost_per_yr": 35,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 50,
        "prof_school_years": 4,
        "trainee_salary": 60,
        "education_debt": 340,
        "loan_rate": 6.5,
        "living_expenses": 45,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 5,
        "salary_growth_to_mid": 3.5,
        "salary_growth_to_peak": 2.5,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    "OD": {
        "undergrad_cost_per_yr": 35,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 45,
        "prof_school_years": 4,
        "trainee_salary": 0,
        "education_debt": 230,
        "loan_rate": 6.5,
        "living_expenses": 45,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 5,
        "salary_growth_to_mid": 3,
        "salary_growth_to_peak": 2,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    # --- law professions ---
    "JD": {
        "undergrad_cost_per_yr": 35,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 55,
        "prof_school_years": 3,
        "trainee_salary": 0,
        "education_debt": 200,
        "loan_rate": 7.0,
        "living_expenses": 48,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 3,
        "salary_growth_to_mid": 4,
        "salary_growth_to_peak": 3,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    "JD+Patent": {
        "undergrad_cost_per_yr": 35,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 55,
        "prof_school_years": 3,
        "trainee_salary": 0,
        "education_debt": 220,
        "loan_rate": 7.0,
        "living_expenses": 48,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 3,
        "salary_growth_to_mid": 4,
        "salary_growth_to_peak": 3,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    "Paralegal": {
        "undergrad_cost_per_yr": 25,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 10,
        "prof_school_years": 1,
        "trainee_salary": 0,
        "education_debt": 40,
        "loan_rate": 6.5,
        "living_expenses": 42,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 0,
        "salary_growth_to_mid": 3,
        "salary_growth_to_peak": 2,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    "Judge": {
        "undergrad_cost_per_yr": 35,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 55,
        "prof_school_years": 3,
        "trainee_salary": 0,
        "education_debt": 200,
        "loan_rate": 7.0,
        "living_expenses": 48,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 0,
        "salary_growth_to_mid": 2,
        "salary_growth_to_peak": 1.5,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    # --- engineering professions ---
    "BS": {
        "undergrad_cost_per_yr": 25,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 0,
        "prof_school_years": 0,
        "trainee_salary": 0,
        "education_debt": 35,
        "loan_rate": 5.5,
        "living_expenses": 45,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 0,
        "salary_growth_to_mid": 5,
        "salary_growth_to_peak": 3,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    "MS": {
        "undergrad_cost_per_yr": 25,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 30,
        "prof_school_years": 2,
        "trainee_salary": 25,
        "education_debt": 55,
        "loan_rate": 5.5,
        "living_expenses": 45,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 0,
        "salary_growth_to_mid": 5,
        "salary_growth_to_peak": 3,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    "PhD": {
        "undergrad_cost_per_yr": 25,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 0,
        "prof_school_years": 5,
        "trainee_salary": 35,
        "education_debt": 35,
        "loan_rate": 5.5,
        "living_expenses": 42,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 0,
        "salary_growth_to_mid": 4,
        "salary_growth_to_peak": 3,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    # --- business professions ---
    "BBA": {
        "undergrad_cost_per_yr": 22,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 0,
        "prof_school_years": 0,
        "trainee_salary": 0,
        "education_debt": 30,
        "loan_rate": 5.5,
        "living_expenses": 42,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 0,
        "salary_growth_to_mid": 4,
        "salary_growth_to_peak": 3,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    "MBA": {
        "undergrad_cost_per_yr": 25,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 75,
        "prof_school_years": 2,
        "trainee_salary": 0,
        "education_debt": 120,
        "loan_rate": 6.5,
        "living_expenses": 52,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 0,
        "salary_growth_to_mid": 7,
        "salary_growth_to_peak": 4,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
    "CPA-CFA": {
        "undergrad_cost_per_yr": 22,
        "undergrad_years": 4,
        "prof_school_cost_per_yr": 5,
        "prof_school_years": 1,
        "trainee_salary": 50,
        "education_debt": 40,
        "loan_rate": 5.5,
        "living_expenses": 42,
        "living_exp_growth": 2.5,
        "overhead_per_yr": 1,
        "salary_growth_to_mid": 5,
        "salary_growth_to_peak": 3,
        "post_peak_growth": 1,
        "npv_discount_rate": 5,
    },
}


def derive_financial_params(spec, profession):
    """Derive financial model params from raw specialty data + profession defaults.

    Uses per-specialty fields: startSalary, midSalary, peakSalary, residencyYears, malpracticeCost
    Uses profession-level defaults for: school cost, debt, trainee salary, overhead, etc.
    """
    defaults = PROFESSION_DEFAULTS.get(profession, PROFESSION_DEFAULTS["MD/DO"])

    res_yrs = _parse_numeric(spec.get("residencyYears", 3))
    if res_yrs is None:
        res_yrs = 3
    res_yrs = int(res_yrs)

    fellowship_years = 0
    fellow_text = spec.get("fellowshipOptions")
    if fellow_text and isinstance(fellow_text, str):
        # try to extract fellowship years from text like "Optional 1-2yr"
        import re
        m = re.search(r'(\d+)\s*(?:-\s*(\d+))?\s*yr', fellow_text.lower())
        if m:
            # use the lower bound
            fellowship_years = int(m.group(1))

    age_independent = 18 + defaults["undergrad_years"] + defaults["prof_school_years"] + res_yrs + fellowship_years

    malpractice = spec.get("malpracticeCost", 10)
    if isinstance(malpractice, str):
        malpractice = _parse_numeric(malpractice) or 10

    mid_salary = spec.get("midSalary", 300)
    peak_salary = spec.get("peakSalary", 400)
    typical_peak = spec.get("typicalPeak", round(mid_salary * 1.2))

    return {
        **defaults,
        "residency_years": res_yrs,
        "fellowship_years": fellowship_years,
        "age_independent": age_independent,
        "starting_salary": spec.get("startSalary", 200),
        "mid_salary": mid_salary,
        "peak_salary": peak_salary,
        "typical_peak": typical_peak,
        "malpractice_per_yr": int(malpractice),
    }


def derive_timeline(spec, profession):
    """Derive training timeline from raw specialty data + profession defaults.

    Returns dict with training phases for the Timeline tab.
    """
    defaults = PROFESSION_DEFAULTS.get(profession, PROFESSION_DEFAULTS["MD/DO"])

    res_yrs = _parse_numeric(spec.get("residencyYears", 3))
    if res_yrs is None:
        res_yrs = 3
    res_yrs = int(res_yrs)

    fellowship_years = 0
    fellow_text = spec.get("fellowshipOptions")
    if fellow_text and isinstance(fellow_text, str):
        import re
        m = re.search(r'(\d+)\s*(?:-\s*(\d+))?\s*yr', fellow_text.lower())
        if m:
            fellowship_years = int(m.group(1))

    college_end = 22
    school_end = college_end + defaults["prof_school_years"]
    residency_end = school_end + res_yrs
    earn_age = residency_end + fellowship_years

    # OD typically has no residency requirement (1yr optional)
    residency = [school_end, residency_end] if res_yrs > 0 else None
    fellowship = [residency_end, residency_end + fellowship_years] if fellowship_years > 0 else None

    return {
        "college": [18, college_end],
        "school": [college_end, school_end],
        "residency": residency,
        "fellowship": fellowship,
        "earnAge": earn_age,
        "startSalary": spec.get("startSalary", 200),
    }


def compute_net_worth_trajectory(params):
    """compute cumulative net worth from age 18 to 65.

    uses the financial assumptions for a single career to model
    yearly income, expenses, debt payments, and investment growth.
    """
    undergrad_years = params.get("undergrad_years", 4)
    prof_school_years = params.get("prof_school_years", 4)
    residency_years = params.get("residency_years", 4)
    fellowship_years = params.get("fellowship_years", 0)

    undergrad_cost = params.get("undergrad_cost_per_yr", 35)
    school_cost = params.get("prof_school_cost_per_yr", 60)
    trainee_salary = params.get("trainee_salary", 65)

    starting_salary = params.get("starting_salary", 300)
    mid_salary = params.get("mid_salary", 400)
    peak_salary = params.get("peak_salary", 600)

    education_debt = params.get("education_debt", 350)
    loan_rate = params.get("loan_rate", 6.5) / 100
    living_expenses = params.get("living_expenses", 50)
    living_exp_growth = params.get("living_exp_growth", 2.5) / 100

    malpractice = params.get("malpractice_per_yr", 10)
    overhead = params.get("overhead_per_yr", 5)
    post_peak_growth = params.get("post_peak_growth", 1) / 100

    # phase boundaries
    undergrad_end = 18 + undergrad_years
    school_end = undergrad_end + prof_school_years
    residency_end = school_end + residency_years
    practice_start = residency_end + fellowship_years

    cumulative = 0
    trajectory = {}

    for age in range(18, 66):
        years_from_start = age - 18
        current_living = living_expenses * (1 + living_exp_growth) ** years_from_start

        if age < undergrad_end:
            net = -(undergrad_cost + current_living)

        elif age < school_end:
            net = -(school_cost + current_living)

        elif age < practice_start:
            net = trainee_salary - current_living

        else:
            years_practicing = age - practice_start

            # salary curve: start -> mid (age 40) -> peak (age 48) -> plateau
            if age <= 40:
                total_years_to_40 = max(1, 40 - practice_start)
                progress = min(1, years_practicing / total_years_to_40)
                salary = starting_salary + progress * (mid_salary - starting_salary)
            elif age <= 48:
                progress = (age - 40) / 8
                salary = mid_salary + progress * (peak_salary - mid_salary)
            else:
                years_past_peak = age - 48
                salary = peak_salary * (1 + post_peak_growth) ** years_past_peak

            practice_costs = current_living + malpractice + overhead

            # loan payments for first 10 years of practice
            if years_practicing < 10:
                annual_payment = (education_debt / 10) * (1 + loan_rate)
                practice_costs += annual_payment

            net = salary - practice_costs

        cumulative += net
        trajectory[age] = round(cumulative)

    return trajectory


def compute_net_worth_at_age(params, target_age):
    """compute net worth at a specific age. convenience wrapper."""
    traj = compute_net_worth_trajectory(params)
    return traj.get(target_age, 0)
