# adding a new profession family

step-by-step guide to adding a new career field (e.g. engineering, law, business).

## prerequisites

- python 3 with `pyyaml`
- node.js + npm (for the frontend)

## step 1: bootstrap the directory

```bash
cd pipeline
python create_field.py --slug engineering --name Engineering
```

this creates:
- `data/engineering/` directory
- `data/engineering/config.yaml` (starter template)
- `data/engineering/specialties/` directory

## step 2: create the YAML data files

### directory structure

```
data/engineering/
  config.yaml                 # metadata, professions, key overrides, decision tree
  scoring_rubric.yaml         # field→category mapping + conversion rules
  scenario_profiles.yaml      # 6 scenario weight profiles
  l1_scores.yaml              # profession-level category scores
  specialties/
    cs.yaml                   # Computer Science specialties with raw fields each
    ee.yaml                   # Electrical Engineering specialties
    me.yaml                   # Mechanical Engineering specialties
```

### specialty YAML format

each file in `specialties/` contains one profession's career tracks:

```yaml
profession: CS

specialties:
  - name: "Software Engineering"
    matchComp: 4
    residencyYears: 0
    callSchedule: 9
    startSalary: 110
    midSalary: 180
    peakSalary: 350
    partTimeFlex: 8
    procedureMix: 2
    adminBurden: 7
    hoursWeek: 45
    burnout: 32
    partTimeFeasibility: 8
    vacation: 4
    careerLongevity: 8
    malpracticeFreq: 1
    malpracticeCost: 2
    geographicFlex: 9
    automationRisk: 5
    handsOnInsulation: 3
    satisfaction: 78
    chooseAgain: 80
    intellectualStim: 8
    varietyRepetition: 7
    patientImpact: 3
    physicalToll: 2
    emotionalToll: 4
    malpracticeLiability: 1
    injuryCareerRisk: 1
```

all decision-type fields are required for scoring. values use the scales defined in `scoring_rubric.yaml`.

## step 3: fill in config.yaml

```yaml
name: Engineering
slug: engineering
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

# stable key/color overrides for careers referenced by the decision tree
key_overrides:
  "Software Engineering":
    key: swe
    color: "#D4A537"
  "Embedded Systems":
    key: embed
    color: "#E8685E"

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

all specialties are scored equally by the pipeline. the `key_overrides` section only
controls stable keys/colors for careers referenced by the decision tree.

## step 4: create the scoring rubric

`scoring_rubric.yaml` maps each raw data field to one or more of the 14 universal
categories, with conversion rules:

```yaml
fields:
  startSalary:
    category: 5
    conversion: linear
    min: 50
    max: 400
    direction: higher_better
  burnout:
    category: 9
    conversion: linear
    min: 15
    max: 60
    direction: lower_better
  matchComp:
    category: 2
    conversion: passthrough
```

adjust min/max ranges to fit your field's data range.

## step 5: run the pipeline

```bash
cd pipeline
python process.py --family engineering
```

this reads your YAML files, applies the scoring framework, and outputs `src/data/engineering.json`.
all specialties get scores, financial model, stress test, and timeline data.

### validate the output

```bash
python process.py --validate ../src/data/engineering.json
```

## step 6: wire up the frontend

edit `src/components/App.jsx`:

```js
import engineeringData from "../data/engineering.json";

const FAMILIES = {
  healthcare: healthcareData,
  engineering: engineeringData,
};
```

## step 7: test

```bash
npm run dev
# click through all 9 tabs — make sure everything renders
npm run build
# should succeed with no errors
```

## tips

- start with 10-15 career tracks, expand later
- the 14-category framework is universal — don't change categories, just fill in the data
- scenario weights can be customized per field in `scenario_profiles.yaml`
- decision tree: keep it to 2-3 questions max
- the career selector in the UI lets users pick any careers for comparison
