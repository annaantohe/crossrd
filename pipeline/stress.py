"""
stress.py — stress test reader for crossrd pipeline

reads the composite stress test resilience data from the excel workbook.
each finalist is scored 1-10 (10 = most resilient) against 4 risk scenarios.
"""


def read_stress_test(wb, key_map):
    """read the stress test scores from the Stress Test sheet.

    args:
        wb: openpyxl workbook (read-only, data_only)
        key_map: dict mapping short track names in excel to finalist keys
                 e.g. {"Mohs": "mohs", "Gen Derm": "derm", ...}
    returns:
        list of dicts like [{"key": "mohs", "ai": 7, "pay": 7, "injury": 4, "match": 2, "avg": 5.0}, ...]
    """
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
