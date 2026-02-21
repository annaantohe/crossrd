#!/usr/bin/env python3
"""
process.py — main pipeline for crossrd
reads specialty data from YAML files and outputs JSON for the frontend.

all specialties are scored equally. no "finalist" concept in the pipeline.

usage:
  python process.py --family healthcare
  python process.py --validate ../src/data/healthcare.json
"""

import argparse
import colorsys
import json
import math
import re
import sys
from datetime import date
from pathlib import Path

from config import (
    CATEGORIES, RADAR_DIMENSIONS, RADAR_CATEGORY_MAP,
    load_family_config, list_families,
)
from scoring import compute_all_category_scores, compute_all_scenario_totals
from financial import derive_financial_params, derive_timeline, compute_net_worth_trajectory
from stress import derive_stress_scores


def generate_key(name, used_keys):
    """Generate a unique URL-safe key from a specialty name."""
    key = name.lower()
    key = re.sub(r'[^a-z0-9]+', '_', key)
    key = key.strip('_')[:24]
    # ensure uniqueness
    base = key
    i = 2
    while key in used_keys:
        key = f"{base}_{i}"
        i += 1
    return key


def generate_colors(n, existing_colors):
    """Generate n visually distinct colors, avoiding existing ones."""
    colors = []
    for i in range(n):
        hue = (i * 0.618033988749895) % 1.0  # golden ratio for good distribution
        r, g, b = colorsys.hsv_to_rgb(hue, 0.55, 0.72)
        colors.append(f"#{int(r*255):02x}{int(g*255):02x}{int(b*255):02x}")
    return colors


def compute_one_in_x(annual_grads, annual_spots):
    """Compute 'out of every X graduates, 1 lands this career'."""
    if not annual_spots or annual_spots <= 0:
        return 999
    return max(1, round(annual_grads / annual_spots))


def one_in_x_to_match_comp(one_in_x):
    """Log-scale mapping: 1 in 1 → 10, 1 in 200+ → 1."""
    log_max = math.log(200)
    clamped = max(1, min(one_in_x, 200))
    score = 10 - (math.log(clamped) / log_max) * 9
    return max(1, min(10, round(score)))


def build_tracks(all_specialties, all_scores, all_scenario_totals,
                 all_financial, all_stress, all_timelines, professions):
    """Build the tracks array with full data for every specialty."""
    tracks = []
    for spec in all_specialties:
        name = spec["name"]
        key = spec["key"]
        prof_label = professions.get(spec["profession"], {}).get("label", spec["profession"])

        track = {
            "name": name,
            "key": key,
            "profession": spec["profession"],
            "group": spec.get("group", ""),
            "color": spec["color"],
            "path": prof_label,
            "raw_data": {
                "startSalary": spec.get("startSalary", 0),
                "midSalary": spec.get("midSalary", 0),
                "peakSalary": spec.get("peakSalary", 0),
                "typicalPeak": spec.get("typicalPeak", 0),
                "hoursWeek": spec.get("hoursWeek", 0),
                "burnout": spec.get("burnout", 0),
                "satisfaction": spec.get("satisfaction", 0),
                "chooseAgain": spec.get("chooseAgain", 0),
                "malpracticeCost": spec.get("malpracticeCost", 0),
                "vacation": spec.get("vacation", 0),
                "matchComp": spec.get("matchComp", 0),
                "annualSpots": spec.get("annualSpots", 0),
                "oneInX": spec.get("oneInX", 999),
                "callSchedule": spec.get("callSchedule", 0),
                "physicalToll": spec.get("physicalToll", 0),
                "emotionalToll": spec.get("emotionalToll", 0),
            },
            "scores": {
                f"category_{cid}": score
                for cid, score in all_scores.get(name, {}).items()
            },
            "scenario_totals": all_scenario_totals.get(name, {}),
            "financial": all_financial.get(name, {}),
            "stress": all_stress.get(name, {}),
            "timeline": all_timelines.get(name, {}),
        }
        tracks.append(track)

    return tracks


def assemble_output(cfg, tracks, scenario_profiles):
    """Assemble the final JSON output structure."""
    professions_out = {}
    for prof, info in cfg["professions"].items():
        professions_out[prof] = {
            "label": info["label"],
            "color": info["color"],
            "track_count": sum(1 for t in tracks if t["profession"] == prof),
        }

    # careers array: all tracks with key/name/color/path/group
    careers = [
        {"key": t["key"], "name": t["name"], "color": t["color"], "path": t["path"], "group": t["group"]}
        for t in tracks
    ]

    # groups: compute stats from tracks for each group defined in config
    groups_cfg = cfg.get("groups", {})
    groups_out = {}
    for slug, info in groups_cfg.items():
        group_tracks = [t for t in tracks if t["group"] == slug]
        peak_salaries = [t["raw_data"].get("peakSalary", 0) for t in group_tracks if t["raw_data"].get("peakSalary")]
        groups_out[slug] = {
            "label": info["label"],
            "icon": info.get("icon", ""),
            "tagline": info.get("tagline", ""),
            "description": info.get("description", ""),
            "count": len(group_tracks),
            "salary_range": [min(peak_salaries), max(peak_salaries)] if peak_salaries else [0, 0],
        }

    return {
        "meta": {
            "profession_family": cfg["slug"],
            "family_name": cfg["name"],
            "headline": cfg.get("headline", f"Career Guide: {cfg['name']}"),
            "subtitle": cfg.get("subtitle", "A Data-Driven Guide"),
            "icon": cfg.get("icon", ""),
            "last_updated": str(date.today()),
            "total_tracks": len(tracks),
            "data_points": 107,
            "source_file": "yaml",
        },
        "professions": professions_out,
        "groups": groups_out,
        "careers": careers,
        "categories": [
            {
                "id": cat["id"],
                "name": cat["name"],
                "weight_default": cat["weight"],
                "description": cat["description"],
            }
            for cat in CATEGORIES
        ],
        "scenario_profiles": scenario_profiles,
        "tracks": tracks,
        # keep decision tree and ranking as optional top-level features
        "decision_tree": cfg.get("decision_tree", {}),
        "decision_tree_results": cfg.get("decision_tree_results", {}),
        "ranking": cfg.get("final_ranking", []),
    }


def process(family_slug, output_path=None):
    """Process a family: score all specialties and output JSON."""
    from yaml_reader import (
        load_specialties, load_l1_scores, load_scoring_rubric,
        load_scenario_profiles,
    )

    repo_root = Path(__file__).parent.parent
    cfg = load_family_config(family_slug)

    if output_path is None:
        output_path = repo_root / "src" / "data" / f"{family_slug}.json"

    print(f"processing {family_slug}...")

    # 1. load data
    print("loading specialty data...")
    all_specialties = load_specialties(family_slug)
    print(f"  loaded {len(all_specialties)} specialties")

    # 1.5 — compute oneInX difficulty metric from annualSpots + annualGraduates
    print("computing oneInX difficulty metric...")
    for spec in all_specialties:
        grads = cfg["professions"].get(spec["profession"], {}).get("annualGraduates", 0)
        spots = spec.get("annualSpots", 0)
        spec["oneInX"] = compute_one_in_x(grads, spots)
        spec["matchComp"] = one_in_x_to_match_comp(spec["oneInX"])

    print("loading L1 scores...")
    l1_scores = load_l1_scores(family_slug)

    print("loading scoring rubric...")
    rubric = load_scoring_rubric(family_slug)

    print("loading scenario profiles...")
    scenario_profiles = load_scenario_profiles(family_slug)

    # 2. assign keys and colors to all specialties
    print("assigning keys and colors...")
    # check if config has legacy key/color overrides
    legacy_keys = {}
    legacy_colors = {}
    for name, info in cfg.get("key_overrides", {}).items():
        legacy_keys[name] = info["key"]
        legacy_colors[name] = info["color"]

    used_keys = set()
    prof_color_idx = {}  # track color index per profession
    n_specs = len(all_specialties)
    palette = generate_colors(n_specs, set(legacy_colors.values()))

    for i, spec in enumerate(all_specialties):
        name = spec["name"]
        if name in legacy_keys:
            spec["key"] = legacy_keys[name]
            spec["color"] = legacy_colors[name]
        else:
            spec["key"] = generate_key(name, used_keys)
            # use profession base color with varying lightness
            prof = spec["profession"]
            prof_base = cfg["professions"].get(prof, {}).get("color", palette[i])
            if prof not in prof_color_idx:
                prof_color_idx[prof] = 0
            idx = prof_color_idx[prof]
            # generate shades within the profession's color family
            spec["color"] = _shade_color(prof_base, idx)
            prof_color_idx[prof] = idx + 1
        used_keys.add(spec["key"])

    # 3. score ALL specialties
    print("computing category scores for all specialties...")
    all_scores = {}
    all_scenario_totals = {}
    for spec in all_specialties:
        cat_scores = compute_all_category_scores(spec, spec["profession"], l1_scores, rubric)
        all_scores[spec["name"]] = cat_scores
        scen_totals = compute_all_scenario_totals(cat_scores, scenario_profiles)
        all_scenario_totals[spec["name"]] = scen_totals

    # 4. derive financial params, stress test, timeline for ALL specialties
    print("deriving financial models...")
    all_financial = {}
    for spec in all_specialties:
        params = derive_financial_params(spec, spec["profession"])
        all_financial[spec["name"]] = params

    print("deriving stress test scores...")
    all_stress = {}
    for spec in all_specialties:
        all_stress[spec["name"]] = derive_stress_scores(spec, spec["profession"])

    print("deriving timelines...")
    all_timelines = {}
    for spec in all_specialties:
        all_timelines[spec["name"]] = derive_timeline(spec, spec["profession"])

    # 5. build tracks and assemble output
    print("building tracks...")
    tracks = build_tracks(
        all_specialties, all_scores, all_scenario_totals,
        all_financial, all_stress, all_timelines, cfg["professions"],
    )

    output = assemble_output(cfg, tracks, scenario_profiles)

    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\ndone! wrote {output_file}")
    print(f"  {output['meta']['total_tracks']} tracks scored")
    return output


def _shade_color(hex_color, index):
    """Generate a shade of a base color by rotating hue slightly and varying saturation."""
    hex_color = hex_color.lstrip("#")
    r, g, b = int(hex_color[0:2], 16) / 255, int(hex_color[2:4], 16) / 255, int(hex_color[4:6], 16) / 255
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    # rotate hue slightly, vary saturation
    h = (h + index * 0.03) % 1.0
    s = max(0.25, min(0.85, s + (index % 3 - 1) * 0.1))
    v = max(0.45, min(0.85, v + (index % 2 * 0.08 - 0.04)))
    r2, g2, b2 = colorsys.hsv_to_rgb(h, s, v)
    return f"#{int(r2*255):02x}{int(g2*255):02x}{int(b2*255):02x}"


def validate(json_path):
    """Validate the output JSON."""
    print(f"validating {json_path}...")
    with open(json_path) as f:
        data = json.load(f)

    errors = []

    if data["meta"]["total_tracks"] < 1:
        errors.append("no tracks found")
    if "careers" not in data or len(data["careers"]) < 1:
        errors.append("no careers array in output")

    # check that every track has scores, scenario_totals, financial, stress, timeline
    for t in data["tracks"]:
        if not t.get("scores"):
            errors.append(f"track '{t['name']}' missing scores")
            break
        if not t.get("scenario_totals"):
            errors.append(f"track '{t['name']}' missing scenario_totals")
            break
        if not t.get("financial"):
            errors.append(f"track '{t['name']}' missing financial")
            break
        if not t.get("stress"):
            errors.append(f"track '{t['name']}' missing stress")
            break
        if not t.get("timeline"):
            errors.append(f"track '{t['name']}' missing timeline")
            break

    # score range sanity check
    for t in data["tracks"][:5]:
        for cat_key, score in t.get("scores", {}).items():
            if not (0.5 <= score <= 10.5):
                errors.append(f"track '{t['name']}' {cat_key} out of range: {score}")

    if errors:
        print(f"\nFAILED — {len(errors)} errors:")
        for e in errors:
            print(f"  x {e}")
        return False
    else:
        print(f"\nPASSED — {data['meta']['total_tracks']} tracks, all checks ok")
        return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="crossrd data pipeline")
    parser.add_argument("--family", help="profession family slug (e.g. healthcare)")
    parser.add_argument("--all", action="store_true", help="process all registered families")
    parser.add_argument("--output", help="path for the output json")
    parser.add_argument("--validate", help="validate an existing json file")
    args = parser.parse_args()

    if args.validate:
        ok = validate(args.validate)
        sys.exit(0 if ok else 1)
    elif args.all:
        families = list_families()
        if not families:
            print("no families found (no data/*/config.yaml files)")
            sys.exit(1)
        print(f"processing {len(families)} families: {', '.join(families)}")
        for fam in families:
            process(fam)
    elif args.family:
        process(args.family, args.output)
    else:
        parser.print_help()
        sys.exit(1)
