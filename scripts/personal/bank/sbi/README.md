# SBI Bank Statement Merger

Merges monthly SBI bank statement Excel files into a single consolidated file for the financial year (April to March).

## Structure

```
Sbi/
├── monthly/          # Individual monthly statement files
│   ├── April.xlsx
│   ├── May.xlsx
│   └── ... (all 12 months)
├── merge.js          # Merge script
├── SBI_FY_2025_26.xlsx  # Output file
└── README.md
```

## Usage

```bash
npm install
node merge.js
```

Output: `SBI_FY_2025_26.xlsx`

## What it does

- Reads all 12 monthly `.xlsx` files from `monthly/` in financial year order (April → March)
- Skips metadata (rows 1-20) and the footer line from each file
- Keeps the header row (row 21) only once
- Combines all transactions into a single sheet named "FY 2025-26"
