#!/usr/bin/env python3
"""
test_regression.py — verify pipeline output hasn't changed unexpectedly

Saves a reference copy of the current JSON, re-runs the pipeline,
and compares the output field by field. Reports differences.

Usage:
    python test_regression.py                     # test healthcare (default)
    python test_regression.py --family engineering
"""

import argparse
import json
import sys
import tempfile
import subprocess
from pathlib import Path

# fields that are expected to change between runs
IGNORE_KEYS = {"last_updated"}


def deep_diff(a, b, path=""):
    """recursively compare two JSON-like structures, return list of differences."""
    diffs = []

    if type(a) != type(b):
        diffs.append(f"{path}: type mismatch ({type(a).__name__} vs {type(b).__name__})")
        return diffs

    if isinstance(a, dict):
        all_keys = set(a.keys()) | set(b.keys())
        for k in sorted(all_keys):
            if k in IGNORE_KEYS:
                continue
            key_path = f"{path}.{k}" if path else k
            if k not in a:
                diffs.append(f"{key_path}: NEW key (not in reference)")
            elif k not in b:
                diffs.append(f"{key_path}: MISSING key (was in reference)")
            else:
                diffs.extend(deep_diff(a[k], b[k], key_path))
    elif isinstance(a, list):
        if len(a) != len(b):
            diffs.append(f"{path}: list length {len(a)} vs {len(b)}")
        for i in range(min(len(a), len(b))):
            diffs.extend(deep_diff(a[i], b[i], f"{path}[{i}]"))
    else:
        if a != b:
            a_str = str(a)[:80]
            b_str = str(b)[:80]
            diffs.append(f"{path}: {a_str} -> {b_str}")

    return diffs


def main():
    parser = argparse.ArgumentParser(description="Pipeline regression test")
    parser.add_argument("--family", default="healthcare", help="Family slug to test")
    args = parser.parse_args()

    repo_root = Path(__file__).parent.parent
    json_path = repo_root / "src" / "data" / f"{args.family}.json"
    pipeline_dir = Path(__file__).parent

    if not json_path.exists():
        print(f"ERROR: {json_path} not found — run the pipeline first", file=sys.stderr)
        sys.exit(1)

    # load current (reference) output
    with open(json_path) as f:
        reference = json.load(f)

    print(f"Reference loaded: {json_path}")
    print(f"Re-running pipeline for '{args.family}'...")

    # re-run pipeline to a temp file
    with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
        tmp_path = tmp.name

    result = subprocess.run(
        [sys.executable, str(pipeline_dir / "process.py"),
         "--family", args.family, "--output", tmp_path],
        capture_output=True, text=True
    )

    if result.returncode != 0:
        print(f"ERROR: pipeline failed:\n{result.stderr}", file=sys.stderr)
        sys.exit(1)

    with open(tmp_path) as f:
        fresh = json.load(f)

    Path(tmp_path).unlink()

    # compare
    diffs = deep_diff(reference, fresh)

    if not diffs:
        print("PASSED — output identical to reference (ignoring: " +
              ", ".join(IGNORE_KEYS) + ")")
    else:
        print(f"DIFFERENCES FOUND ({len(diffs)}):")
        for d in diffs[:50]:
            print(f"  {d}")
        if len(diffs) > 50:
            print(f"  ... and {len(diffs) - 50} more")
        sys.exit(1)


if __name__ == "__main__":
    main()
