#!/usr/bin/env python3
"""
Script to renumber IDs in illegal dataset to avoid collision with legal dataset
"""

import csv
import os

def renumber_ilegal_csv():
    """Renumber IDs in illegal dataset starting from legal dataset max ID + 1"""

    # Paths
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    legal_csv = os.path.join(project_root, 'output/data/crawl_serper/data_legal/ALL_DATA_COMBINED_LEGAL.csv')
    ilegal_csv = os.path.join(project_root, 'output/data/crawl_serper/data_ilegal/ALL_DATA_COMBINED_ILEGAL.csv')
    ilegal_backup = os.path.join(project_root, 'output/data/crawl_serper/data_ilegal/ALL_DATA_COMBINED_ILEGAL_BACKUP.csv')

    # Get max ID from legal dataset
    max_legal_id = 0
    with open(legal_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            max_legal_id = max(max_legal_id, int(row['No']))

    print(f"Max Legal ID: {max_legal_id}")

    # Backup original ilegal file
    import shutil
    shutil.copy2(ilegal_csv, ilegal_backup)
    print(f"Backup created: {ilegal_backup}")

    # Read ilegal data
    ilegal_rows = []
    with open(ilegal_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            ilegal_rows.append(row)

    # Renumber IDs starting from max_legal_id + 1
    start_id = max_legal_id + 1
    for i, row in enumerate(ilegal_rows):
        row['No'] = str(start_id + i)

    # Write back to ilegal CSV
    with open(ilegal_csv, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(ilegal_rows)

    print(f"✅ Renumbered {len(ilegal_rows)} illegal records")
    print(f"   New ID range: {start_id} - {start_id + len(ilegal_rows) - 1}")
    print(f"   Total unique IDs: {max_legal_id + len(ilegal_rows)}")

if __name__ == "__main__":
    renumber_ilegal_csv()
