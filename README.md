# crossrd

**what should i actually be when i grow up?** a data-driven career guide that compares 125+ career paths across healthcare and law to help you figure out what's actually worth it.

i built this because i wanted to see the *real* numbers — not just "doctors make good money" or "lawyers are rich" but like, which ones? how much school? how much debt? will AI take your job? is it worth $200K in loans?

## [check it out live](https://annaantohe.github.io/crossrd/)

## what's inside

- **125+ careers** across two fields so far:
  - **healthcare** — 64 careers across 4 professions (MD/DO, DDS/DMD, DPM, OD)
  - **law** — 61 careers across 4 professions (JD, JD+Patent, Paralegal, Judge)
- **107 data points** per career — salary, hours, burnout, satisfaction, AI risk, malpractice, and more
- **14 scoring categories** weighted into 6 radar dimensions (money, happiness, free time, hard to get in, robot-proof, safety net)
- interactive charts, a decision tree, stress tests, and a net worth calculator

## how it works

```
pick a field → explore groups → star your favorites → compare them side by side
```

### the tabs

| tab | what it shows |
|-----|--------------|
| Explore | browse careers by group, drill into details, star the ones you like |
| Compare | radar chart, net worth race, salary bars, stress test, timeline |
| Quiz | decision tree that narrows down your best fit |
| Sources | every data source cited with links |

### the pipeline

```
yaml data files → python scores everything → json → react shows it
```

each career family has its own data directory with yaml configs. a python pipeline reads the raw data, applies a 14-category scoring rubric, runs financial models, stress tests, and outputs a single json file that the frontend reads.

## tech stack

- **data pipeline:** python + pandas + pyyaml
- **frontend:** react + vite + recharts
- **hosting:** github pages
- **fonts:** playfair display + dm sans

## run it yourself

```bash
# install frontend
npm install

# start dev server
npm run dev

# rebuild the data
cd pipeline
pip install -r requirements.txt
python process.py --family healthcare
python process.py --family law
```

## project structure

```
data/
  healthcare/          # healthcare career family
    config.yaml        # groups, professions, decision tree, ranking
    scoring_rubric.yaml
    l1_scores.yaml     # profession-level baselines
    financial_model.yaml
    stress_test.yaml
    specialties/       # raw data per profession
      md_do.yaml       # 46 MD/DO careers
      dds_dmd.yaml     # 14 dental careers
      dpm.yaml         # 2 podiatry careers
      od.yaml          # 2 optometry careers
  law/                 # law career family
    config.yaml
    scoring_rubric.yaml
    l1_scores.yaml
    financial_model.yaml
    stress_test.yaml
    specialties/
      jd.yaml          # 55 JD careers
      jd_patent.yaml   # 2 patent attorney careers
      paralegal.yaml   # 3 paralegal careers
      judge.yaml       # 1 judge career
pipeline/
  process.py           # main pipeline script (--family flag)
  config.py            # universal constants (14 categories, radar dims)
  financial.py         # net worth model
  stress.py            # stress test scenarios
src/
  components/          # react components
  data/                # generated json (don't edit these)
  styles/
  utils/
```

## adding new career fields

the architecture is modular — each profession family gets its own data directory:

```bash
# create data/engineering/ with config + rubric + specialties
# fill in the yaml files, then:
python pipeline/process.py --family engineering
```

the frontend automatically picks up new families through the family picker.

---

built with data and coffee
