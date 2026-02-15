# 🩺 crossrd

**which doctor should you become?** a data-driven career guide that compares 42 healthcare career paths to help you figure out what's actually worth it.

i built this because i wanted to see the *real* numbers — not just "doctors make good money" but like, which ones? how much school? will a robot take your job? is it worth 12 years of training?

## 🔗 [check it out live →](https://annaantohe.github.io/crossrd/)

## what's inside

- **42 careers** across 4 types of doctors (MD, dentist, podiatrist, optometrist)
- **107 data points** per career — salary, hours, burnout, satisfaction, you name it
- **6 finalists** that made the final cut after scoring everything
- interactive charts, a decision tree, risk analysis, and a race-to-a-million calculator

## the tabs

| tab | what it shows |
|-----|--------------|
| 🏠 Home | overview + stats |
| 🏟️ All 42 | every career in a sortable table + scatter plot |
| 🏁 Race | net worth from age 18 to 65 |
| ⭐ Scores | radar chart comparing 6 dimensions |
| ⏳ Time | how long each path takes |
| ⚠️ Risk | what could go wrong (AI, pay cuts, injuries) |
| 💰 Money | salary comparisons + lifetime earnings |
| 🌳 Answer | decision tree to find YOUR best career |

## how it works

```
excel spreadsheet → python crunches the numbers → json file → react shows it
```

the data lives in an excel workbook with 17 sheets. a python script reads it, scores everything using a weighted 14-category system, and spits out a json file. the react app just reads that json and makes it pretty.

## tech stack

- **data pipeline:** python + pandas
- **frontend:** react + vite + recharts
- **hosting:** github pages (free!)
- **fonts:** playfair display + dm sans

## run it yourself

```bash
# install stuff
npm install

# start dev server
npm run dev

# rebuild the data (if you change the excel)
cd pipeline
pip install -r requirements.txt
python process.py --input ../data/healthcare/career_framework_v4.xlsx --output ../src/data/healthcare.json
```

## the verdict

> **#1 pick: general dermatology** — best risk-adjusted choice overall.
> skin cancer surgeon (mohs) earns the most, but derm has the best balance of money, lifestyle, and safety.

---

built with 📊 data and ☕ coffee
