#!/usr/bin/env python3
"""
create_field.py — bootstrap a new profession family

Usage:
    python create_field.py --slug engineering --name Engineering

Creates:
    data/<slug>/config.yaml   (starter YAML with empty sections)
    data/<slug>/               directory

Prints next-step instructions after creation.
"""

import argparse
import sys
from pathlib import Path

STARTER_YAML = """\
# config.yaml — {name} profession family
# fill in all sections below, then run:
#   python pipeline/process.py --family {slug}

name: {name}
slug: {slug}
source: career_framework.xlsx
icon: "\\U0001F4BC"  # change to a relevant emoji
headline: "Which {name} Career Is Right for You?"
subtitle: "A Data-Driven Guide"

# list each profession type (degree/path) with a label and color
professions:
  # EXAMPLE:
  # BS/MS:
  #   label: "Engineer"
  #   color: "#E55934"

# list each finalist career with key, teen_name, color, jsx_name
finalists:
  # EXAMPLE:
  # "Software Engineering":
  #   key: swe
  #   teen_name: "Software Engineer"
  #   color: "#D4A537"
  #   jsx_name: "Software Eng."

# order the finalist keys for consistent display
finalist_order: []

# map profession keys to Excel sheet names
l2_sheets:
  # EXAMPLE:
  # "BS/MS": "L2 Matrix — BS-MS"

# column index (0-based) -> field name mapping for L2 Matrix sheets
l2_columns:
  0: name
  1: residencyYears
  3: matchComp
  4: startSalary
  5: midSalary
  6: peakSalary
  9: partTimeFlex
  12: procedureMix
  13: callSchedule
  14: adminBurden
  16: hoursWeek
  17: burnout
  18: partTimeFeasibility
  19: vacation
  20: careerLongevity
  21: malpracticeFreq
  22: malpracticeCost
  23: geographicFlex
  26: automationRisk
  27: handsOnInsulation
  28: satisfaction
  29: chooseAgain
  30: intellectualStim
  31: varietyRepetition
  32: patientImpact
  34: physicalToll
  35: emotionalToll
  36: malpracticeLiability
  37: injuryCareerRisk

# stress test: maps Excel short names -> finalist keys
stress_key_map: {{}}

# scenario display name -> slug key mapping
scenario_map:
  Default: default
  Equal Weight: equal_weight
  Max Earnings: max_earnings
  Best Lifestyle: best_lifestyle
  Fastest to Practice: fastest_to_practice
  Most Procedural: most_procedural

# training timeline data (hand-crafted)
timeline_data: []

# final ranking (hand-crafted)
final_ranking: []

# decision tree (hand-crafted)
decision_tree:
  q: "First question?"
  "yes":
    q: "Second question?"
    "yes":
      q: "Third question?"
      procedural: null
      variety: null
    "no": null
  "no":
    q: "What matters most?"
    options: []

# decision tree result cards
decision_tree_results: {{}}
"""


def main():
    parser = argparse.ArgumentParser(description="Bootstrap a new profession family")
    parser.add_argument("--slug", required=True, help="URL-safe slug (e.g. engineering)")
    parser.add_argument("--name", required=True, help="Display name (e.g. Engineering)")
    args = parser.parse_args()

    repo_root = Path(__file__).parent.parent
    family_dir = repo_root / "data" / args.slug

    if family_dir.exists():
        print(f"ERROR: {family_dir} already exists", file=sys.stderr)
        sys.exit(1)

    family_dir.mkdir(parents=True)
    config_path = family_dir / "config.yaml"
    config_path.write_text(STARTER_YAML.format(name=args.name, slug=args.slug))

    print(f"Created {family_dir}/")
    print(f"Created {config_path}")
    print()
    print("Next steps:")
    print(f"  1. Copy or create your Excel workbook at data/{args.slug}/career_framework.xlsx")
    print(f"  2. Edit data/{args.slug}/config.yaml — fill in professions, finalists, etc.")
    print(f"  3. Run: python pipeline/process.py --family {args.slug}")
    print(f"  4. Import the JSON in src/components/App.jsx")


if __name__ == "__main__":
    main()
