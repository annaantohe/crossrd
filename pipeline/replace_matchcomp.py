#!/usr/bin/env python3
"""One-time script to replace matchComp with annualSpots in all specialty YAML files."""

import re
from pathlib import Path

# MD/DO annualSpots mapping (NRMP 2025 + fellowship data)
MD_DO_SPOTS = {
    "General Surgery": 1778,
    "Orthopedic Surgery": 929,
    "Neurosurgery": 268,
    "Cardiothoracic Surgery": 185,
    "Vascular Surgery": 230,
    "Plastic & Reconstructive Surgery": 221,
    "Trauma / Acute Care Surgery": 350,
    "Transplant Surgery": 80,
    "Pediatric Surgery": 45,
    "Colorectal Surgery": 85,
    "Hand Surgery": 150,
    "Spine Surgery": 200,
    "Sports Medicine (Surgical)": 300,
    "Bariatric Surgery": 150,
    "Interventional Cardiology": 450,
    "Interventional Radiology": 207,
    "Gastroenterology (Endoscopy)": 759,
    "Urology": 403,
    "OB/GYN": 1604,
    "Ophthalmology": 525,
    "ENT / Otolaryngology": 361,
    "Mohs Surgery (Dermatology)": 120,
    "Interventional Pain Medicine": 350,
    "Pulm / Critical Care": 844,
    "Diagnostic Radiology": 975,
    "Dermatology (General/Medical)": 554,
    "Anesthesiology": 1805,
    "Emergency Medicine": 3068,
    "Psychiatry": 2388,
    "Internal Medicine (General)": 11750,
    "Family Medicine": 5357,
    "Pediatrics (General)": 3193,
    "Cardiology (Non-interventional)": 897,
    "Hematology / Oncology": 809,
    "Nephrology": 500,
    "Rheumatology": 302,
    "Endocrinology": 420,
    "Infectious Disease": 450,
    "Allergy / Immunology": 200,
    "Physical Medicine & Rehabilitation": 450,
    "Radiation Oncology": 200,
    "Pathology": 635,
    "Nuclear Medicine": 150,
    "Hospice / Palliative Medicine": 877,
    "Geriatrics": 388,
    "Neonatology": 500,
    "Neurology": 950,
    "Sleep Medicine": 250,
    "Preventive / Occupational Medicine": 300,
    "Medical Genetics": 70,
    "Critical Care Medicine": 500,
}

# DDS/DMD annualSpots (CODA + ADEA data)
DDS_DMD_SPOTS = {
    "Oral & Maxillofacial Surgery": 242,
    "Endodontics": 340,
    "Periodontics": 310,
    "Prosthodontics": 195,
    "Orthodontics": 380,
    "Pediatric Dentistry": 465,
    "General Dentistry": 5083,
}

# DPM annualSpots (CASPR match data)
DPM_SPOTS = {
    "Podiatric Surgery (Foot & Ankle)": 460,
    "Sports Medicine / Biomechanics": 45,
    "Wound Care / Diabetic Limb Salvage": 70,
}

# OD annualSpots (ASCO + residency data)
OD_SPOTS = {
    "Medical / Therapeutic Optometry": 215,
    "Surgical Co-Management / Specialty": 255,
    "General Optometry": 1321,
}

# JD annualSpots (NALP/ABA employment data)
JD_SPOTS = {
    "M&A Attorney": 2200,
    "Securities & Capital Markets": 1400,
    "Private Equity / VC Law": 800,
    "Banking & Finance Law": 1200,
    "Tax Attorney (Transactional)": 700,
    "Corporate Governance": 600,
    "Restructuring / Bankruptcy": 700,
    "Commercial Litigation (Big Law)": 2800,
    "White Collar Criminal Defense": 900,
    "Class Action / Mass Tort": 850,
    "Product Liability Defense": 650,
    "Appellate Litigation": 350,
    "International Arbitration": 400,
    "Prosecutor (DA/ADA)": 2200,
    "Federal Prosecutor (DOJ/AUSA)": 550,
    "Public Defender": 1200,
    "Criminal Defense (Private)": 800,
    "Trademark & Brand Law": 500,
    "Copyright / Entertainment Law": 350,
    "Trade Secrets": 300,
    "Civil Rights / Constitutional Law": 400,
    "Legal Aid / Poverty Law": 1000,
    "Environmental Law (Nonprofit)": 300,
    "Immigration Law (Gov/Nonprofit)": 500,
    "Policy / Legislative Counsel": 400,
    "Military JAG": 600,
    "Family Law / Divorce": 1400,
    "Estate Planning / Trusts & Wills": 900,
    "Elder Law": 400,
    "Immigration Law (Private)": 700,
    "Personal Injury (Plaintiff)": 1200,
    "Medical Malpractice (Plaintiff)": 350,
    "Workers' Compensation": 400,
    "Real Estate Transactional": 650,
    "Real Estate Litigation": 400,
    "Land Use / Zoning": 250,
    "Construction Law": 300,
    "Healthcare Regulatory": 500,
    "Financial Regulatory (SEC/FINRA)": 450,
    "Environmental Regulatory (EPA)": 350,
    "Privacy & Data Protection": 600,
    "In-House Compliance Officer": 700,
    "Employment Law (Management)": 600,
    "Employment Law (Plaintiff)": 500,
    "Labor Relations / Union Law": 300,
    "Employee Benefits / ERISA": 400,
    "Tech Transactions / SaaS Licensing": 400,
    "Cybersecurity Law": 300,
    "AI & Emerging Tech Law": 200,
    "FinTech / Crypto Law": 200,
    "Mediator / Arbitrator": 300,
    "Law Professor / Academia": 150,
    "Management Consulting (JD)": 350,
    "Legal Tech / Legal Ops": 300,
    "FBI / Federal Agent (JD)": 150,
}

# JD+Patent annualSpots
JD_PATENT_SPOTS = {
    "Patent Prosecution": 650,
    "Patent Litigation": 350,
}

# Judge annualSpots
JUDGE_SPOTS = {
    "Judge Track (Clerk → Judge)": 3560,
}

# Paralegal annualSpots
PARALEGAL_SPOTS = {
    "Litigation Paralegal": 8100,
    "Corporate Paralegal": 5400,
    "IP Paralegal": 4500,
}


def replace_in_file(filepath, spots_map):
    """Replace matchComp with annualSpots in a YAML file."""
    text = filepath.read_text()

    current_name = None
    lines = text.split('\n')
    new_lines = []
    replaced = 0

    for line in lines:
        # track current specialty name
        name_match = re.match(r'^- name:\s*["\']?(.+?)["\']?\s*$', line)
        if name_match:
            current_name = name_match.group(1)

        # replace matchComp line with annualSpots
        mc_match = re.match(r'^(\s+)matchComp:\s*(\d+)', line)
        if mc_match and current_name:
            indent = mc_match.group(1)
            if current_name in spots_map:
                new_lines.append(f"{indent}annualSpots: {spots_map[current_name]}")
                replaced += 1
                continue
            else:
                print(f"  WARNING: no spots data for '{current_name}', keeping matchComp")

        new_lines.append(line)

    filepath.write_text('\n'.join(new_lines))
    print(f"  {filepath.name}: replaced {replaced} matchComp → annualSpots")
    return replaced


if __name__ == "__main__":
    root = Path(__file__).parent.parent / "data"

    # Healthcare
    print("=== Healthcare ===")
    replace_in_file(root / "healthcare" / "specialties" / "dds_dmd.yaml", DDS_DMD_SPOTS)
    replace_in_file(root / "healthcare" / "specialties" / "dpm.yaml", DPM_SPOTS)
    replace_in_file(root / "healthcare" / "specialties" / "od.yaml", OD_SPOTS)

    # Law
    print("\n=== Law ===")
    replace_in_file(root / "law" / "specialties" / "jd.yaml", JD_SPOTS)
    replace_in_file(root / "law" / "specialties" / "jd_patent.yaml", JD_PATENT_SPOTS)
    replace_in_file(root / "law" / "specialties" / "judge.yaml", JUDGE_SPOTS)
    replace_in_file(root / "law" / "specialties" / "paralegal.yaml", PARALEGAL_SPOTS)

    print("\nDone! All files updated.")
