# adding a new profession family

step-by-step guide to adding a new career field (e.g. engineering, law, business).

## prerequisites

- python 3 with `openpyxl`, `pandas`, `pyyaml`
- node.js + npm (for the frontend)

## step 1: bootstrap the directory

```bash
cd pipeline
python create_field.py --slug engineering --name Engineering
```

this creates:
- `data/engineering/` directory
- `data/engineering/config.yaml` (starter template)

## step 2: create the excel workbook

create `data/engineering/career_framework.xlsx` with these sheets:

### required sheets

| sheet | what it contains |
|-------|-----------------|
| Career Tracks | all career tracks (one per row) with profession type and basic stats |
| Data Points Framework | the 107+ data points with definitions, sources, scoring rules |
| Category Weights | 14 categories with weights for each scenario profile |
| Scenario Profiles | 6 scenario profiles (Default, Equal Weight, Max Earnings, etc.) |
| L1 Scoring Results | all tracks scored on 14 categories under each scenario |
| L2 Matrix — [profession] | one sheet per profession type with detailed data per track |
| Finals Matrix | 6 finalist tracks scored across all scenarios |
| Career Life Models | financial assumptions for each finalist (age 18-65) |
| Net Worth Trajectory | year-by-year net worth data for each finalist |
| Financial Assumptions | income, expenses, taxes, savings rates per finalist |
| Stress Test | 4-scenario resilience scores for each finalist |
| Decision Summary | final ranking + decision tree logic |

### L2 Matrix columns

the column mapping in `config.yaml` tells the pipeline which column has which data point. the default mapping covers 38 columns — adjust `l2_columns` in your config if your Excel layout differs.

key columns (0-indexed):
- 0: career name
- 4: starting salary ($K)
- 6: peak salary ($K)
- 16: hours per week
- 17: burnout rate (%)
- 28: satisfaction (%)

## step 3: fill in config.yaml

edit `data/engineering/config.yaml`:

```yaml
name: Engineering
slug: engineering
source: career_framework.xlsx
icon: "\U0001F527"
headline: "Which Engineer Should You Become?"
subtitle: "A Data-Driven Guide"

professions:
  CS:
    label: "Computer Science"
    color: "#E55934"
  EE:
    label: "Electrical Engineering"
    color: "#1982C4"
  ME:
    label: "Mechanical Engineering"
    color: "#8AC926"

finalists:
  "Software Engineering":
    key: swe
    teen_name: "Software Engineer"
    color: "#D4A537"
    jsx_name: "Software Eng."
  # ... more finalists

finalist_order:
  - swe
  # ... more keys

l2_sheets:
  CS: "L2 Matrix — CS"
  EE: "L2 Matrix — EE"
  ME: "L2 Matrix — ME"

stress_key_map:
  "SWE": swe
  # maps Excel short names to finalist keys

timeline_data:
  - key: swe
    college: [18, 22]
    school: null
    residency: null
    fellowship: null
    earnAge: 22
    startSalary: 110

final_ranking:
  - rank: 1
    track: Software Engineering
    key: swe
    note: Highest ceiling

decision_tree:
  q: "Do you want to work with hardware or software?"
  # ... build your tree

decision_tree_results:
  swe:
    tagline: "Highest ceiling, most flexibility"
    stat: "$200K+ peak • Work from anywhere"
```

## step 4: run the pipeline

```bash
cd pipeline
python process.py --family engineering
```

this reads your Excel, applies the scoring framework, and outputs `src/data/engineering.json`.

### validate the output

```bash
python process.py --validate ../src/data/engineering.json
```

## step 5: wire up the frontend

edit `src/components/App.jsx`:

```js
import engineeringData from "../data/engineering.json";

const FAMILIES = {
  healthcare: healthcareData,
  engineering: engineeringData,
};
```

## step 6: test

```bash
npm run dev
# click through all 8 tabs — make sure everything renders
npm run build
# should succeed with no errors
```

## step 7: regression test

```bash
cd pipeline
python test_regression.py --family engineering
```

saves the current output, re-runs the pipeline, and flags any differences.

## tips

- start with 10-15 career tracks, expand later
- the 14-category framework is universal — don't change categories, just fill in the data
- scenario weights can be customized per field in the Category Weights sheet
- `l2_columns` mapping should match your Excel layout exactly
- finalist selection: pick 4-6 careers that represent the breadth of the field
- decision tree: keep it to 2-3 questions max for teens
