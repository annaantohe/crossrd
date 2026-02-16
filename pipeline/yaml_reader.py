"""
yaml_reader.py — YAML data loading for crossrd pipeline

replaces the openpyxl-based excel readers. loads raw specialty data,
L1 scores, scenario profiles, financial model, and stress test from
YAML files under data/<family>/.
"""

import yaml
from pathlib import Path


def _data_dir(family_slug):
    """return the data directory for a family."""
    repo_root = Path(__file__).parent.parent
    return repo_root / "data" / family_slug


def load_specialties(family_slug):
    """load all specialty raw data from YAML files.

    reads every file in data/<family>/specialties/*.yaml and returns
    a flat list of specialty dicts, each with a 'profession' key added.
    """
    spec_dir = _data_dir(family_slug) / "specialties"
    all_specialties = []

    for yaml_file in sorted(spec_dir.glob("*.yaml")):
        with open(yaml_file) as f:
            data = yaml.safe_load(f)
        profession = data["profession"]
        for spec in data["specialties"]:
            spec["profession"] = profession
            all_specialties.append(spec)

    return all_specialties


def load_l1_scores(family_slug):
    """load profession-level L1 scores.

    returns dict: {profession: {cat_id: {scores: [...], count: N, average: X}}}
    """
    path = _data_dir(family_slug) / "l1_scores.yaml"
    with open(path) as f:
        data = yaml.safe_load(f)
    return data["professions"]


def load_scoring_rubric(family_slug):
    """load the scoring rubric.

    returns dict of field definitions, each with category/categories, type, conversion.
    """
    path = _data_dir(family_slug) / "scoring_rubric.yaml"
    with open(path) as f:
        data = yaml.safe_load(f)
    return data["fields"]


def load_scenario_profiles(family_slug):
    """load scenario weight profiles.

    returns dict: {scenario_name: {cat_id_str: weight}}
    cat_id keys are strings to match the JSON output format.
    """
    path = _data_dir(family_slug) / "scenario_profiles.yaml"
    with open(path) as f:
        data = yaml.safe_load(f)
    # convert int keys to strings for JSON compatibility
    profiles = {}
    for name, weights in data["profiles"].items():
        profiles[name] = {str(k): v for k, v in weights.items()}
    return profiles


def load_financial_model(family_slug):
    """load financial model assumptions and reference trajectory.

    returns (finalists_dict, reference_trajectory_list)
    """
    path = _data_dir(family_slug) / "financial_model.yaml"
    with open(path) as f:
        data = yaml.safe_load(f)
    return data["finalists"], data.get("reference_trajectory", [])


def load_stress_test(family_slug):
    """load stress test scores.

    returns list of dicts: [{"key": "mohs", "ai": 7, "pay": 7, ...}, ...]
    """
    path = _data_dir(family_slug) / "stress_test.yaml"
    with open(path) as f:
        data = yaml.safe_load(f)

    result = []
    for key, scores in data["scores"].items():
        entry = {"key": key}
        entry.update(scores)
        entry["avg"] = round(sum(scores.values()) / len(scores), 1)
        result.append(entry)

    return result


def load_ground_truth(family_slug):
    """load ground truth scores for validation.

    returns (category_scores_dict, scenario_totals_dict)
    """
    path = _data_dir(family_slug) / "ground_truth.yaml"
    if not path.exists():
        return None, None
    with open(path) as f:
        data = yaml.safe_load(f)
    return data.get("category_scores", {}), data.get("scenario_totals", {})
