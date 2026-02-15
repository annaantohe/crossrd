# DEV_NOTES.md — Project Dev Notes

## Project Overview

**crossrd** — a data-driven interactive career comparison website.
Compares 42 healthcare career paths across 4 professions (MD/DO, DDS/DMD, DPM, OD).

**Stack:** Python/pandas → JSON → React (Vite) → GitHub Pages
**Live URL:** https://annaantohe.github.io/crossrd/

---

## ⚠️ Git & GitHub Account Isolation (CRITICAL)

This project uses a **separate GitHub account** from the machine owner's work account.
All commits and pushes MUST go through Anna's account. The setup is:

### Local git config (repo-level only — do NOT change global config)
```
user.name  = annaantohe
user.email = anna.antohe@gmail.com
```

### Remote URL includes token for auth
```
origin = https://annaantohe:<TOKEN>@github.com/annaantohe/crossrd.git
```

### Rules
- **NEVER** run `git config --global` — it would break the machine owner's work projects
- **NEVER** run `gh auth login` or change `gh` CLI auth — it's logged into a different account
- **ALWAYS** use `curl` with Anna's token for GitHub API calls (repo settings, Pages, etc.)
- **ALWAYS** use `git push origin main` (the remote URL handles auth automatically)
- The `.gitignore` excludes `github-cred.txt` — never commit credentials

---

## Architecture

```
crossrd/
├── data/healthcare/              # Source Excel workbook (THE source of truth)
├── pipeline/                     # Python/pandas → reads Excel → outputs JSON
│   ├── config.py                 # Shared constants (categories, weights, colors)
│   ├── process.py                # Main pipeline script
│   ├── scoring.py                # Weighted scoring engine
│   ├── financial_model.py        # Lifetime net worth projections
│   └── stress_test.py            # 4-scenario risk analysis
├── src/
│   ├── data/healthcare.json      # Generated JSON (git-tracked)
│   ├── components/               # React components (one per tab)
│   ├── styles/theme.js           # Design system constants
│   ├── main.jsx                  # App entry point
│   └── index.html                # HTML shell with Google Fonts
├── package.json
└── vite.config.js                # base: '/crossrd/' for GitHub Pages
```

## Data Flow
```
career_framework_v4.xlsx → python pipeline/process.py → healthcare.json → React reads JSON
```
- Excel is the **single source of truth** — never hardcode data in React components
- The JSON is git-tracked so the site builds without needing Python

## Commands

```bash
# Python pipeline
cd pipeline
python process.py --input ../data/healthcare/career_framework_v4.xlsx --output ../src/data/healthcare.json

# Frontend dev
npm install
npm run dev          # localhost:5173

# Production build
npm run build        # outputs to dist/
```

## Design System

**Fonts:** Playfair Display (headers, 700/800) + DM Sans (body, 400-700)
**Layout:** max-width 680px, centered, background #fafaf8

**Finalist career colors:**
| Key | Name | Color |
|-----|------|-------|
| mohs | Skin Cancer Surgeon | #D4A537 (gold) |
| derm | Skin Doctor | #E8685E (coral) |
| eye | Eye Surgeon | #2BA5B5 (teal) |
| pod | Foot & Ankle Surgeon | #2D3A6E (navy) |
| sport | Sports Foot Doctor | #3EA66B (green) |
| wound | Wound Healing Doctor | #8B6CAE (purple) |

**Profession colors:**
| Profession | Color |
|-----------|-------|
| MD/DO | #E55934 |
| DDS/DMD | #1982C4 |
| DPM | #8AC926 |
| OD | #6A4C93 |

## Commit Style

Casual high-schooler tone. Examples:
- "add the scatter plot to all-42 view"
- "fix the radar chart labels"
- "hook up json data to the components"

## Key Rules

- Target audience is a 14-year-old — simple language, emoji headers, "So What?" boxes
- All financial figures in $K (thousands)
- Scores are 1-10 (10 = better), except Match Competitiveness is inverted (1 = hardest)
- Mobile-first design, horizontal scroll for wide tables
- Use Recharts for all charts (Line, Bar, Radar, Scatter)
- `career-guide.jsx` in the root is the visual reference — the Vite app should match it exactly
