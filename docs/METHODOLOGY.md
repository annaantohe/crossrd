# scoring methodology

how i scored 42 careers across 107 data points.

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

every data point gets converted to a 1-10 score using linear interpolation:

```
score = 1 + (value - min) / (max - min) × 9
```

- **higher-is-better** metrics (salary, satisfaction): higher value → higher score
- **lower-is-better** metrics (burnout, hours): formula inverted so lower → higher score
- min/max are set per data point based on the range across all careers in the field

## category scores

each category score = average of its data points' scores.

there are two types of data points:
- **Decision data points** (~38 per career in L2 matrix): used for scenario scoring
- **Reference data points** (~69 per career): context/flavor, not scored

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

for each finalist career, i modeled net worth from age 18 to 65:

- **ages 18-22**: college (tuition, expenses, some part-time income)
- **ages 22-26**: professional school (tuition, living costs, loans accumulating interest)
- **ages 26-29/31**: residency/training (resident salary, loan payments start)
- **ages 29/31-65**: practice (real salary, taxes, cost of living, savings)

key assumptions:
- 6.5% student loan rate
- 25% effective tax rate during practice
- $60K annual living expenses (inflation-adjusted)
- 20% savings rate on post-tax, post-expense income
- 7% annual investment returns

the "Career Life Models" sheet in the Excel has all these numbers per career.

## stress test

4 bad scenarios, each career scored 1-10 on resilience:

| scenario | what it tests |
|----------|---------------|
| AI Takes Job | how replaceable by automation? |
| Pay Cut 20% | can you survive a 20% salary drop? |
| Hurt Hands | what if you can't do procedures? |
| Not Accepted | what if you don't get into the program? |

**toughness score** = average across all 4 scenarios.

scores come from the "Stress Test" sheet in the Excel workbook.

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

## finalist selection

from the full field (42 careers), 6 finalists were selected:
1. top scorers across multiple scenarios
2. diversity across profession types (MD, DPM, etc.)
3. at least one "wild card" — a career that doesn't score #1 overall but excels in a specific dimension

## data sources

- Bureau of Labor Statistics (BLS)
- Medscape Physician Compensation Reports
- NRMP Match Data
- AAMC/AACPM/ASCO admissions data
- Doximity salary surveys
- published satisfaction/burnout studies
- specialty-specific practice surveys
