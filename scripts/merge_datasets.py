#!/usr/bin/env python3
"""
Script to merge legal and illegal datasets into one unified CSV file
"""

import csv
import os

def merge_datasets():
    """Merge legal and illegal datasets into one unified CSV"""

    # Paths
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    legal_csv = os.path.join(project_root, 'output/data/crawl_serper/data_legal/ALL_DATA_COMBINED_LEGAL.csv')
    ilegal_csv = os.path.join(project_root, 'output/data/crawl_serper/data_ilegal/ALL_DATA_COMBINED_ILEGAL.csv')
    merged_csv = os.path.join(project_root, 'output/data/crawl_serper/ALL_DATA_COMBINED_MERGED.csv')

    print("🔄 Merging datasets...")

    # Read legal data
    legal_rows = []
    with open(legal_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            legal_rows.append(row)

    print(f"✅ Read {len(legal_rows)} legal records")

    # Read illegal data
    ilegal_rows = []
    with open(ilegal_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            ilegal_rows.append(row)

    print(f"✅ Read {len(ilegal_rows)} illegal records")

    # Combine all rows
    all_rows = legal_rows + ilegal_rows

    # Write merged CSV
    with open(merged_csv, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"\n🎉 Merge Complete!")
    print(f"   Output file: {merged_csv}")
    print(f"   Total records: {len(all_rows)}")
    print(f"   Legal: {len(legal_rows)} (ID 1-{len(legal_rows)})")
    print(f"   Illegal: {len(ilegal_rows)} (ID {len(legal_rows)+1}-{len(all_rows)})")

if __name__ == "__main__":
    merge_datasets()
