"""
scoring.py — weighted scoring utilities for crossrd pipeline

handles converting raw data to 1-10 scores and computing weighted averages.
the scoring engine uses the rubric (scoring_rubric.yaml) to convert raw
specialty data into category scores, then applies scenario weights.
"""


def score_numeric(value, min_val, max_val, higher_is_better=True):
    """convert a numeric value to a 1-10 score using linear interpolation.

    args:
        value: the raw numeric value
        min_val: minimum value in the observed range
        max_val: maximum value in the observed range
        higher_is_better: if True, higher values get higher scores
    returns:
        float score between 1.0 and 10.0
    """
    if max_val == min_val:
        return 5.5
    # clamp to range
    clamped = max(min_val, min(max_val, value))
    normalized = (clamped - min_val) / (max_val - min_val)  # 0 to 1
    if not higher_is_better:
        normalized = 1 - normalized
    return round(1 + normalized * 9, 1)  # scale to 1-10


def _parse_numeric(value):
    """try to extract a numeric value from a potentially complex string.

    handles formats like '5+2', '3-4', '1+3 (intern + 3yr)', '5 (integrated)'.
    returns float or None if unparseable.
    """
    if isinstance(value, (int, float)):
        return float(value)
    s = str(value).strip()
    # try direct conversion first
    try:
        return float(s)
    except ValueError:
        pass
    # try extracting first number from common patterns
    import re
    # "5+2" or "5+2 or 6" -> take the first sum: 5+2=7
    m = re.match(r'^(\d+)\+(\d+)', s)
    if m:
        return float(int(m.group(1)) + int(m.group(2)))
    # "3-4" -> take the midpoint
    m = re.match(r'^(\d+)-(\d+)', s)
    if m:
        return (float(m.group(1)) + float(m.group(2))) / 2
    # "1+3 (intern + 3yr)" -> take 1+3=4
    m = re.match(r'^(\d+)\+(\d+)\s', s)
    if m:
        return float(int(m.group(1)) + int(m.group(2)))
    # last resort: extract first number
    m = re.search(r'(\d+)', s)
    if m:
        return float(m.group(1))
    return None


def convert_to_score(raw_value, conversion):
    """convert a raw data value to a 1-10 score using the rubric conversion config.

    args:
        raw_value: the raw field value from specialty data
        conversion: dict with 'method' key ('passthrough' or 'linear')
    returns:
        float score between 1.0 and 10.0, or None if value is unparseable
    """
    if raw_value is None:
        return None
    if conversion is None:
        return None

    method = conversion["method"]

    if method == "passthrough":
        num = _parse_numeric(raw_value)
        return float(num) if num is not None else None

    if method == "linear":
        num = _parse_numeric(raw_value)
        if num is None:
            return None
        return score_numeric(
            num,
            conversion["min"],
            conversion["max"],
            conversion.get("higher_is_better", True),
        )

    raise ValueError(f"unknown conversion method: {method}")


def compute_category_score(data_point_scores):
    """compute the average score across all Decision data points in a category.

    only "Decision" data points feed into this — "Reference" ones are skipped.
    """
    if not data_point_scores:
        return 5.0
    return round(sum(data_point_scores) / len(data_point_scores), 2)


def compute_all_category_scores(specialty_data, profession, l1_scores, rubric):
    """compute all 14 category scores for a specialty.

    blends L1 (profession-level) and L2 (specialty-level) data points.

    for categories with only L1 data: uses the L1 average directly.
    for categories with both L1 and L2: averages all data points together.
    for categories with only L2 data: averages converted L2 scores.

    args:
        specialty_data: dict of raw field values for one specialty
        profession: profession key (e.g. "MD/DO")
        l1_scores: dict from l1_scores.yaml for this profession
        rubric: dict of field definitions from scoring_rubric.yaml
    returns:
        dict of {cat_id: score} for categories 1-14
    """
    l1_data = l1_scores.get(profession, {}).get("l1_data_points", {})

    # collect L2 data point scores per category
    l2_by_cat = {}  # {cat_id: [scores]}
    for field_name, field_def in rubric.items():
        if field_def["type"] != "decision":
            continue

        raw_val = specialty_data.get(field_name)
        if raw_val is None:
            continue

        score = convert_to_score(raw_val, field_def["conversion"])
        if score is None:
            continue

        # handle single or multi-category fields
        cats = field_def.get("categories", [field_def.get("category")])
        if not isinstance(cats, list):
            cats = [cats]

        for cat_id in cats:
            if cat_id not in l2_by_cat:
                l2_by_cat[cat_id] = []
            l2_by_cat[cat_id].append(score)

    # now blend L1 + L2 for each category
    scores = {}
    for cat_id in range(1, 15):
        l1_cat = l1_data.get(cat_id, {})
        l2_scores = l2_by_cat.get(cat_id, [])

        if l2_scores and l1_cat:
            # mixed category: average all L1 data points + all L2 data points
            l1_individual = l1_cat.get("scores", [])
            all_points = [float(s) for s in l1_individual] + l2_scores
            scores[cat_id] = round(sum(all_points) / len(all_points), 2)
        elif l2_scores:
            # L2 only
            scores[cat_id] = round(sum(l2_scores) / len(l2_scores), 2)
        elif l1_cat:
            # L1 only: use pre-computed average
            scores[cat_id] = l1_cat.get("average", 5.0)
        else:
            scores[cat_id] = 5.0

    return scores


def compute_scenario_total(category_scores, scenario_weights):
    """compute the weighted total score for a given scenario.

    args:
        category_scores: dict of {cat_id: score} (1-10 scale)
        scenario_weights: dict of {cat_id: weight_percent} (must sum to ~100)
    returns:
        float weighted average on a 1-10 scale
    """
    total = 0
    for cat_id, weight in scenario_weights.items():
        total += category_scores.get(int(cat_id), 5.0) * weight / 100
    return round(total, 2)


def compute_all_scenario_totals(category_scores, profiles):
    """compute scenario totals for all profiles.

    args:
        category_scores: dict of {cat_id: score}
        profiles: dict of {scenario_name: {cat_id: weight}}
    returns:
        dict of {scenario_name: weighted_total}
    """
    return {
        name: compute_scenario_total(category_scores, weights)
        for name, weights in profiles.items()
    }
