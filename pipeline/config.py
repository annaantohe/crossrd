"""
config.py — universal constants + per-field YAML loader for crossrd pipeline

the 14 scoring categories and radar dimensions are the same for every
profession family. everything else (professions, finalists, column mappings)
lives in per-field YAML config files under data/<family>/config.yaml.
"""

import yaml
from pathlib import Path

# ── universal constants (same for every profession family) ──

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

# the 6 radar chart dimensions (consolidated from 14 categories)
RADAR_DIMENSIONS = [
    {"dim": "Money", "emoji": "\U0001f4b0"},
    {"dim": "Happiness", "emoji": "\U0001f60a"},
    {"dim": "Free Time", "emoji": "\u23f0"},
    {"dim": "Hard to Get In", "emoji": "\U0001f3af"},
    {"dim": "Robot-Proof", "emoji": "\U0001f916"},
    {"dim": "Safety Net", "emoji": "\U0001f6e1\ufe0f"},
]

# maps each radar dimension to the category IDs it averages
RADAR_CATEGORY_MAP = {
    "Money": [5, 7],
    "Happiness": [12],
    "Free Time": [9],
    "Hard to Get In": [1, 2, 4],
    "Robot-Proof": [11],
    "Safety Net": [14],
}


# ── per-field config loading ──

def load_family_config(family_slug):
    """load the YAML config for a profession family.

    looks for data/<family_slug>/config.yaml relative to the repo root.
    returns a dict with all per-field settings.
    """
    repo_root = Path(__file__).parent.parent
    config_path = repo_root / "data" / family_slug / "config.yaml"
    if not config_path.exists():
        raise FileNotFoundError(f"no config found at {config_path}")
    with open(config_path) as f:
        return yaml.safe_load(f)


def list_families():
    """list all registered profession families.

    scans data/*/config.yaml and returns a sorted list of family slugs.
    """
    repo_root = Path(__file__).parent.parent
    data_dir = repo_root / "data"
    families = []
    for d in sorted(data_dir.iterdir()):
        if d.is_dir() and (d / "config.yaml").exists():
            families.append(d.name)
    return families
