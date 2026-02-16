"""
scoring.py — weighted scoring utilities for crossrd pipeline

handles converting raw data to 1-10 scores and computing weighted averages.
the excel workbook pre-computes most scores, but these functions are used
when scoring needs to happen in the pipeline (e.g. for new fields).
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
    normalized = (value - min_val) / (max_val - min_val)  # 0 to 1
    if not higher_is_better:
        normalized = 1 - normalized
    return round(1 + normalized * 9, 1)  # scale to 1-10


def compute_category_score(data_point_scores):
    """compute the average score across all Decision data points in a category.

    only "Decision" data points feed into this — "Reference" ones are skipped.
    """
    if not data_point_scores:
        return 5.0
    return round(sum(data_point_scores) / len(data_point_scores), 2)


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
