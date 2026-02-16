"""
financial.py — financial model and timeline functions for crossrd pipeline

reads the Career Life Models sheet from the excel workbook and builds
the net worth trajectory, money scoreboard data, and training timelines.
"""


def read_net_worth_trajectory(wb, finalist_order):
    """read the cumulative net worth data from Career Life Models sheet.

    args:
        wb: openpyxl workbook (read-only, data_only)
        finalist_order: list of finalist keys in column order (e.g. ["mohs", "derm", ...])
    returns:
        list of dicts like [{"age": 18, "mohs": -85, "derm": -85, ...}, ...]
    """
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
            for i, key in enumerate(finalist_order):
                val = row[1 + i]
                point[key] = int(val) if val is not None else 0
            trajectory.append(point)

    print(f"  read net worth trajectory: {len(trajectory)} data points")
    return trajectory


def read_financial_assumptions(wb, finalist_order):
    """read the financial model assumptions from Career Life Models sheet.

    args:
        wb: openpyxl workbook
        finalist_order: list of finalist keys in column order
    returns:
        dict of {assumption_label: {finalist_key: value, ...}, ...}
    """
    ws = wb["Career Life Models"]

    assumptions = {}
    # assumptions are in rows 5-40 (after header rows)
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
        for i, key in enumerate(finalist_order):
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


def build_money_data(wb, finalist_order):
    """build the money scoreboard data from Career Life Models.

    extracts starting salary, peak salary, and lifetime earnings for each finalist.
    """
    assumptions = read_financial_assumptions(wb, finalist_order)

    money = []
    for key in finalist_order:
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


def build_timeline_data(family_config):
    """return timeline data from the family config.

    timeline data is hand-crafted per field (not in the excel workbook)
    and stored in the YAML config file.
    """
    return family_config.get("timeline_data", [])
