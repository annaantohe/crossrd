#!/usr/bin/env python3
"""
process.py — main pipeline for crossrd
reads the career framework excel workbook and outputs healthcare.json

usage:
  python process.py --input ../data/healthcare/career_framework_v4.xlsx --output ../src/data/healthcare.json
  python process.py --validate ../src/data/healthcare.json
"""

import argparse
import json
import sys
from datetime import date
from pathlib import Path

import openpyxl
import pandas as pd

from config import (
    CATEGORIES, PROFESSIONS, FINALISTS, L2_COLUMNS, L2_SHEETS,
    FINALIST_ORDER, SCENARIO_NAMES, RADAR_DIMENSIONS, FINAL_RANKING,
    DECISION_TREE,
)


def read_career_tracks(wb):
    """read the master list of 42 career tracks from the Career Tracks sheet"""
    ws = wb["Career Tracks"]
    tracks = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if row[0] is None:
            break
        tracks.append({
            "id": int(row[0]),
            "profession": row[1],
            "name": row[2],
            "category": row[3],
            "procedural_intensity": row[4],
            "status": row[5],
        })
    print(f"  read {len(tracks)} career tracks")
    return tracks


def read_l2_matrix(wb, profession):
    """read the raw specialty data from an L2 Matrix sheet"""
    sheet_name = L2_SHEETS[profession]
    ws = wb[sheet_name]

    specialties = []
    # data starts at row 5 (row 1 = title, row 2 = category tags, row 3 = headers, row 4 = Dec/Ref)
    for row in ws.iter_rows(min_row=5, values_only=True):
        if row[0] is None:
            break

        spec = {"profession": profession}
        for col_idx, field_name in L2_COLUMNS.items():
            val = row[col_idx]
            # convert numeric strings to numbers
            if field_name != "name" and val is not None:
                try:
                    val = float(val) if isinstance(val, (int, float)) else float(val)
                    # keep as int if it's a whole number
                    if val == int(val):
                        val = int(val)
                except (ValueError, TypeError):
                    pass
            spec[field_name] = val

        # check if this track is a finalist
        spec["finalist"] = spec["name"] in FINALISTS
        if spec["finalist"]:
            info = FINALISTS[spec["name"]]
            spec["finalist_key"] = info["key"]
            spec["teen_name"] = info["teen_name"]
            spec["finalist_color"] = info["color"]

        specialties.append(spec)

    print(f"  read {len(specialties)} specialties from {sheet_name}")
    return specialties


def read_finals_matrix(wb):
    """read the category scores and scenario totals for the 6 finalists"""
    ws = wb["Finals Matrix"]

    # read category scores (rows 4-17, cols D-I = indices 3-8)
    category_scores = {}  # key -> {cat_id: score}
    finalist_cols = ["mohs", "derm", "eye", "pod", "sport", "wound"]

    for row in ws.iter_rows(min_row=4, max_row=17, values_only=True):
        if row[0] is None:
            continue
        # skip the header row with "#"
        try:
            cat_id = int(row[0])
        except (ValueError, TypeError):
            continue
        for i, key in enumerate(finalist_cols):
            if key not in category_scores:
                category_scores[key] = {}
            val = row[3 + i]
            if val is not None:
                category_scores[key][cat_id] = round(float(val), 2)

    # read scenario totals (starts after "SCENARIO-WEIGHTED TOTAL SCORES" header)
    scenario_totals = {}  # key -> {scenario: score}
    scenario_rows = []
    found_scenarios = False
    for row in ws.iter_rows(min_row=1, values_only=True):
        if row[0] == "Scenario":
            found_scenarios = True
            continue
        if found_scenarios and row[0] is not None:
            scenario_name = row[0]
            if scenario_name.startswith("KEY"):
                break
            scores = {}
            for i, key in enumerate(finalist_cols):
                val = row[1 + i]
                if val is not None:
                    scores[key] = round(float(val), 2)
            scenario_rows.append((scenario_name, scores))

    # map scenario display names to our keys
    scenario_map = {
        "Default": "default",
        "Equal Weight": "equal_weight",
        "Max Earnings": "max_earnings",
        "Best Lifestyle": "best_lifestyle",
        "Fastest to Practice": "fastest_to_practice",
        "Most Procedural": "most_procedural",
    }

    for display_name, scores in scenario_rows:
        scenario_key = scenario_map.get(display_name, display_name.lower().replace(" ", "_"))
        for finalist_key, score in scores.items():
            if finalist_key not in scenario_totals:
                scenario_totals[finalist_key] = {}
            scenario_totals[finalist_key][scenario_key] = score

    print(f"  read finals matrix: {len(category_scores)} finalists, {len(scenario_rows)} scenarios")
    return category_scores, scenario_totals


def read_net_worth_trajectory(wb):
    """read the cumulative net worth data from Career Life Models"""
    ws = wb["Career Life Models"]

    # find the trajectory section (starts with "Age" header after row 39)
    trajectory = []
    found_header = False
    for row in ws.iter_rows(min_row=39, values_only=True):
        if row[0] == "Age":
            found_header = True
            continue
        if found_header:
            if row[0] is None or (isinstance(row[0], str) and not row[0].isdigit()):
                break
            age = int(row[0])
            point = {"age": age}
            for i, key in enumerate(FINALIST_ORDER):
                val = row[1 + i]
                point[key] = int(val) if val is not None else 0
            trajectory.append(point)

    print(f"  read net worth trajectory: {len(trajectory)} data points")
    return trajectory


def read_financial_assumptions(wb):
    """read the financial model assumptions from Career Life Models"""
    ws = wb["Career Life Models"]

    assumptions = {}
    # assumptions are in rows 6-26 (after header rows)
    for row in ws.iter_rows(min_row=5, max_row=40, values_only=True):
        if row[0] is None:
            continue
        label = str(row[0]).strip()
        if label in ("KEY ASSUMPTIONS", "LIFETIME FINANCIAL SUMMARY (Age 18-65)",
                      "CUMULATIVE NET WORTH TRAJECTORY ($K) — EVERY 5 YEARS",
                      "KEY FINANCIAL INSIGHT"):
            continue
        if label == "Age":
            break
        values = {}
        for i, key in enumerate(FINALIST_ORDER):
            val = row[1 + i]
            if val is not None:
                try:
                    val = float(val) if isinstance(val, (int, float)) else float(val)
                    if val == int(val):
                        val = int(val)
                except (ValueError, TypeError):
                    pass
            values[key] = val
        assumptions[label] = values

    return assumptions


def read_stress_test(wb):
    """read the stress test scores from the Stress Test sheet"""
    ws = wb["Stress Test"]

    # the composite table starts after "COMPOSITE STRESS TEST RESILIENCE"
    stress_data = []
    found_composite = False
    found_header = False

    for row in ws.iter_rows(min_row=1, values_only=True):
        if row[0] == "COMPOSITE STRESS TEST RESILIENCE":
            found_composite = True
            continue
        if found_composite and row[0] == "Track":
            found_header = True
            continue
        if found_header:
            if row[0] is None or row[0] == "STRESS TEST INSIGHT":
                break
            # map track names to our keys
            track_name = row[0]
            key_map = {
                "Mohs": "mohs", "Gen Derm": "derm", "Ophtho": "eye",
                "Pod Surg": "pod", "Sports Med": "sport", "Wound Care": "wound",
            }
            key = key_map.get(track_name, track_name.lower())
            stress_data.append({
                "key": key,
                "ai": int(row[1]) if row[1] else 0,
                "pay": int(row[2]) if row[2] else 0,
                "injury": int(row[3]) if row[3] else 0,
                "match": int(row[4]) if row[4] else 0,
                "avg": round(float(row[5]), 1) if row[5] else 0,
            })

    print(f"  read stress test: {len(stress_data)} finalists")
    return stress_data


def read_scenario_profiles(wb):
    """read the 6 scenario weight profiles"""
    ws = wb["Scenario Profiles"]

    # column mapping: B=Equal Weight, C=Max Earnings, D=Best Lifestyle,
    # E=Fastest to Practice, F=Most Procedural
    profiles = {"default": {}}
    scenario_cols = {
        1: "equal_weight",
        2: "max_earnings",
        3: "best_lifestyle",
        4: "fastest_to_practice",
        5: "most_procedural",
    }

    for cat_idx, row in enumerate(ws.iter_rows(min_row=2, max_row=15, values_only=True)):
        cat_id = cat_idx + 1
        # default weights come from config
        from config import CATEGORIES
        profiles["default"][str(cat_id)] = CATEGORIES[cat_idx]["weight"]

        for col_offset, scenario_name in scenario_cols.items():
            if scenario_name not in profiles:
                profiles[scenario_name] = {}
            val = row[col_offset]
            profiles[scenario_name][str(cat_id)] = int(val) if val is not None else 7

    return profiles


def read_radar_data(finals_scores):
    """
    build the 6-dimension radar chart data from the finals category scores.

    the 6 dimensions are consolidated from the 14 categories:
    - Money = avg of cat 5 (Financial) + cat 7 (Economics)
    - Happiness = cat 12 (Satisfaction)
    - Free Time = cat 9 (Lifestyle)
    - Hard to Get In = avg of cat 1 (Pre-Prof) + cat 2 (Admissions) + cat 4 (PGT)
    - Robot-Proof = cat 11 (AI Impact)
    - Safety Net = cat 14 (Risk Factors)
    """
    radar = []
    for dim_info in RADAR_DIMENSIONS:
        point = {"dim": dim_info["dim"], "emoji": dim_info["emoji"]}
        for key in FINALIST_ORDER:
            scores = finals_scores.get(key, {})
            if dim_info["dim"] == "Money":
                point[key] = round((scores.get(5, 5) + scores.get(7, 5)) / 2, 1)
            elif dim_info["dim"] == "Happiness":
                point[key] = round(scores.get(12, 5), 1)
            elif dim_info["dim"] == "Free Time":
                point[key] = round(scores.get(9, 5), 1)
            elif dim_info["dim"] == "Hard to Get In":
                # this is inverted: high score = easy to get in (good for candidate)
                # so we use the raw average of cats 1, 2, 4
                vals = [scores.get(c, 5) for c in [1, 2, 4]]
                point[key] = round(sum(vals) / len(vals), 1)
            elif dim_info["dim"] == "Robot-Proof":
                point[key] = round(scores.get(11, 5), 1)
            elif dim_info["dim"] == "Safety Net":
                point[key] = round(scores.get(14, 5), 1)
        radar.append(point)
    return radar


def build_money_data(wb):
    """build the money scoreboard data from Career Life Models"""
    assumptions = read_financial_assumptions(wb)

    money = []
    for key in FINALIST_ORDER:
        start = assumptions.get("Starting Salary ($K)", {}).get(key, 0)
        peak = assumptions.get("Peak Salary ($K, age 48+)", {}).get(key, 0)
        lifetime = assumptions.get("Cumulative Net Worth at 65 ($K)", {}).get(key, 0)
        money.append({
            "key": key,
            "start": int(start) if start else 0,
            "peak": int(peak) if peak else 0,
            "lifetime": int(lifetime) if lifetime else 0,
        })

    return money


def build_timeline_data():
    """build the training timeline data for the 6 finalists"""
    # this is based on the known training paths
    timelines = [
        {"key": "mohs", "college": [18, 22], "school": [22, 26], "residency": [26, 30],
         "fellowship": [30, 31], "earnAge": 31, "startSalary": 450},
        {"key": "derm", "college": [18, 22], "school": [22, 26], "residency": [26, 30],
         "fellowship": None, "earnAge": 30, "startSalary": 350},
        {"key": "eye", "college": [18, 22], "school": [22, 26], "residency": [26, 30],
         "fellowship": [30, 31], "earnAge": 31, "startSalary": 350},
        {"key": "pod", "college": [18, 22], "school": [22, 26], "residency": [26, 29],
         "fellowship": None, "earnAge": 29, "startSalary": 220},
        {"key": "sport", "college": [18, 22], "school": [22, 26], "residency": [26, 29],
         "fellowship": None, "earnAge": 29, "startSalary": 160},
        {"key": "wound", "college": [18, 22], "school": [22, 26], "residency": [26, 29],
         "fellowship": None, "earnAge": 29, "startSalary": 200},
    ]
    return timelines


def build_tracks_json(all_specialties, finals_scores, scenario_totals):
    """build the tracks array for the output json"""
    tracks = []
    for spec in all_specialties:
        track = {
            "name": spec["name"],
            "profession": spec["profession"],
            "finalist": spec.get("finalist", False),
            "raw_data": {
                "startSalary": spec.get("startSalary", 0),
                "midSalary": spec.get("midSalary", 0),
                "peakSalary": spec.get("peakSalary", 0),
                "hoursWeek": spec.get("hoursWeek", 0),
                "burnout": spec.get("burnout", 0),
                "satisfaction": spec.get("satisfaction", 0),
                "chooseAgain": spec.get("chooseAgain", 0),
                "malpracticeCost": spec.get("malpracticeCost", 0),
                "vacation": spec.get("vacation", 0),
                "matchComp": spec.get("matchComp", 0),
                "callSchedule": spec.get("callSchedule", 0),
                "physicalToll": spec.get("physicalToll", 0),
                "emotionalToll": spec.get("emotionalToll", 0),
            },
        }

        if spec.get("finalist"):
            key = spec["finalist_key"]
            track["teen_name"] = spec["teen_name"]
            track["finalist_color"] = spec["finalist_color"]
            track["finalist_key"] = key
            track["scores"] = {
                f"category_{cat_id}": score
                for cat_id, score in finals_scores.get(key, {}).items()
            }
            track["scenario_totals"] = scenario_totals.get(key, {})

        tracks.append(track)

    return tracks


def process(input_path, output_path):
    """main pipeline: read excel, build json, write output"""
    print(f"reading {input_path}...")
    wb = openpyxl.load_workbook(input_path, read_only=True, data_only=True)

    # 1. read all the raw data
    print("reading career tracks...")
    career_tracks = read_career_tracks(wb)

    print("reading L2 matrix data...")
    all_specialties = []
    for profession in L2_SHEETS:
        specs = read_l2_matrix(wb, profession)
        all_specialties.extend(specs)

    print("reading finals matrix...")
    finals_scores, scenario_totals = read_finals_matrix(wb)

    print("reading scenario profiles...")
    scenario_profiles = read_scenario_profiles(wb)

    print("reading financial data...")
    net_worth = read_net_worth_trajectory(wb)
    money_data = build_money_data(wb)

    print("reading stress test...")
    stress_data = read_stress_test(wb)

    wb.close()

    # 2. build derived data
    print("building radar chart data...")
    radar_data = read_radar_data(finals_scores)

    print("building timeline data...")
    timeline_data = build_timeline_data()

    print("building tracks json...")
    tracks = build_tracks_json(all_specialties, finals_scores, scenario_totals)

    # 3. assemble the output
    output = {
        "meta": {
            "profession_family": "healthcare",
            "last_updated": str(date.today()),
            "total_tracks": len(all_specialties),
            "finalists": sum(1 for t in tracks if t["finalist"]),
            "data_points": 107,
            "source_file": "career_framework_v4.xlsx",
        },
        "professions": {
            prof: {
                "label": info["label"],
                "color": info["color"],
                "track_count": sum(1 for s in all_specialties if s["profession"] == prof),
            }
            for prof, info in PROFESSIONS.items()
        },
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
        "finalists": {
            "ranking": FINAL_RANKING,
            "net_worth_trajectory": net_worth,
            "radar_dimensions": radar_data,
            "stress_test": stress_data,
            "money_data": money_data,
            "timeline_data": timeline_data,
            "decision_tree": DECISION_TREE,
        },
    }

    # 4. write it out
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\ndone! wrote {output_file}")
    print(f"  {output['meta']['total_tracks']} tracks, {output['meta']['finalists']} finalists")
    return output


def validate(json_path):
    """validate the output json against expected values"""
    print(f"validating {json_path}...")
    with open(json_path) as f:
        data = json.load(f)

    errors = []

    # check track count
    if data["meta"]["total_tracks"] != 42:
        errors.append(f"expected 42 tracks, got {data['meta']['total_tracks']}")

    if data["meta"]["finalists"] != 6:
        errors.append(f"expected 6 finalists, got {data['meta']['finalists']}")

    # check a few known values from the reference data
    # mohs should have startSalary=450, peakSalary=1000
    mohs = next((t for t in data["tracks"] if t.get("finalist_key") == "mohs"), None)
    if mohs:
        if mohs["raw_data"]["startSalary"] != 450:
            errors.append(f"mohs startSalary: expected 450, got {mohs['raw_data']['startSalary']}")
        if mohs["raw_data"]["peakSalary"] != 1000:
            errors.append(f"mohs peakSalary: expected 1000, got {mohs['raw_data']['peakSalary']}")
    else:
        errors.append("mohs finalist not found")

    # check net worth trajectory
    if len(data["finalists"]["net_worth_trajectory"]) != 10:
        errors.append(f"expected 10 net worth points, got {len(data['finalists']['net_worth_trajectory'])}")

    # check the age-65 values
    last_point = data["finalists"]["net_worth_trajectory"][-1]
    if last_point.get("mohs") != 22376:
        errors.append(f"mohs net worth at 65: expected 22376, got {last_point.get('mohs')}")

    # check stress test
    if len(data["finalists"]["stress_test"]) != 6:
        errors.append(f"expected 6 stress test entries, got {len(data['finalists']['stress_test'])}")

    if errors:
        print(f"\nFAILED — {len(errors)} errors:")
        for e in errors:
            print(f"  ✗ {e}")
        return False
    else:
        print("\nPASSED — all checks ok ✓")
        return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="crossrd data pipeline")
    parser.add_argument("--input", help="path to the excel workbook")
    parser.add_argument("--output", help="path for the output json")
    parser.add_argument("--validate", help="validate an existing json file")
    args = parser.parse_args()

    if args.validate:
        ok = validate(args.validate)
        sys.exit(0 if ok else 1)
    elif args.input and args.output:
        process(args.input, args.output)
    else:
        parser.print_help()
        sys.exit(1)
