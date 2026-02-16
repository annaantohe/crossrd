# scoring methodology

how we scored 64 healthcare careers across 107 data points.

## data source

all data lives in YAML files under `data/healthcare/`:

| file | what it contains |
|------|-----------------|
| `specialties/*.yaml` | 38 raw data fields per specialty (salary, hours, burnout, etc.) |
| `l1_scores.yaml` | profession-level category scores (L1 data points, labeled) |
| `scoring_rubric.yaml` | rules to convert raw data → 1-10 scores |
| `scenario_profiles.yaml` | 6 scenario weight profiles |
| `data_points_framework.yaml` | master catalog of all 107 data points |
| `config.yaml` | metadata, key overrides, rankings, decision tree |

data sourced from Medscape, Doximity, BLS, NRMP, AAMC, and published specialty surveys (see Sources tab for full list).

## the 14-category framework

every career gets scored on 14 categories. each category has a weight (how much it matters) and contains multiple data points.

| # | category | weight | what it measures |
|---|----------|--------|-----------------|
| 1 | Pre-Professional Phase | 7 | how hard is it to start? |
| 2 | Admissions Competitiveness | 7 | can you realistically get in? |
| 3 | Professional School | 5 | what's the school experience like? |
| 4 | Post-Graduate Training | 8 | how long/hard is the road after school? |
| 5 | Financial Picture | 10 | cost, debt, time to financial freedom |
| 6 | Scope of Practice & Autonomy | 8 | what can you do independently? |
| 7 | Career Economics | 12 | how much do you earn over a career? |
| 8 | Daily Life & Practice Reality | 8 | what does the work feel like? |
| 9 | Lifestyle & Work-Life Balance | 10 | can you have a life outside work? |
| 10 | Job Market & Demand | 5 | will you find work? |
| 11 | AI Revolution Impact | 7 | how future-proof is this career? |
| 12 | Professional Satisfaction | 8 | will you enjoy this long-term? |
| 13 | Demographics & Culture | 3 | culture fit? |
| 14 | Risk Factors & Downsides | 5 | hidden costs and dangers |

**total weight: 103** (not 100 — that's intentional, it's a priority ranking)

## scoring: raw data → 1-10

### L2 scoring (specialty level)

each specialty has 38 raw data fields. the scoring rubric converts decision fields to a 1-10 score:

- **passthrough**: value is already on a 1-10 scale, used directly
- **linear interpolation**: for numeric values like salary or hours:

```
score = 1 + (value - min) / (max - min) × 9
```

- **higher-is-better** (salary, satisfaction): higher value → higher score
- **lower-is-better** (burnout, hours): formula inverted so lower → higher score
- min/max are set per field based on the range across all careers
- **reference fields** (text descriptions, notes) are stored but not scored

### L1 scoring (profession level)

some categories (1, 3, 13) only have profession-level data points, not specialty-level.
other categories (5, 6, 10) have both L1 and L2 components.

for mixed categories:
```
combined = (l1_score × l1_count + sum(l2_scores)) / (l1_count + l2_count)
```

## category scores

each category score = weighted average of its data points' scores.

all 64 specialties are scored through the same scoring engine — no special treatment.

## scenario-weighted totals

6 scenario profiles weight the 14 categories differently:

| scenario | what it optimizes |
|----------|------------------|
| Default | balanced (uses the weights above) |
| Equal Weight | every category weighted equally |
| Max Earnings | financial + career economics heavy |
| Best Lifestyle | work-life balance + satisfaction heavy |
| Fastest to Practice | pre-professional + training phases heavy |
| Most Procedural | scope of practice heavy |

**scenario total** = Σ (category_score × scenario_weight) / Σ scenario_weights

## the financial model

for every career, net worth is modeled from age 18 to 65 using per-specialty fields + profession-level defaults:

- **ages 18-22**: college (tuition, expenses)
- **ages 22-26**: professional school (tuition, living costs, loans accumulating interest)
- **ages 26-29/31**: residency/training (trainee salary, loan payments start)
- **ages 29/31-65**: practice (salary curve from starting → mid → peak, expenses, loan payoff)

profession-level defaults (tuition, debt, trainee salary, overhead) are in `pipeline/financial.py`.
per-specialty overrides come from the YAML fields (startSalary, peakSalary, residencyYears, etc.).

## stress test

4 bad scenarios, each career scored 1-10 on resilience (derived from raw specialty data):

| scenario | what it tests | derived from |
|----------|---------------|-------------|
| AI Takes Job | how replaceable by automation? | automationRisk, handsOnInsulation |
| Pay Cut 20% | can you survive a salary drop? | geographicFlex, satisfaction, adminBurden |
| Hurt Hands | what if you can't do procedures? | procedureMix, partTimeFlex, careerLongevity |
| Not Accepted | what if you don't match? | profession-level base + matchComp |

**toughness score** = average across all 4 scenarios.

## radar chart (6 dimensions)

the 14 categories are consolidated into 6 dimensions for the radar chart:

| dimension | from categories |
|-----------|----------------|
| Money | Financial Picture + Career Economics |
| Happiness | Professional Satisfaction |
| Free Time | Lifestyle & Work-Life Balance |
| Hard to Get In | Pre-Professional + Admissions + Post-Grad Training |
| Robot-Proof | AI Revolution Impact |
| Safety Net | Risk Factors & Downsides |

each dimension = average of its source category scores.

## data sources

see the Sources tab in the app for a full list of 50+ references including:
- Medscape Physician Compensation Reports
- Doximity Physician Salary Reports
- Bureau of Labor Statistics (BLS)
- NRMP Match Data
- AAMC/AACPM admissions data
- Published satisfaction and burnout studies
- Specialty-specific practice surveys
