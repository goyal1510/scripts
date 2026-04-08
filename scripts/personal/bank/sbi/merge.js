import XLSX from "xlsx";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, "monthly");

// Financial year order: April to March
const MONTHS = [
  "April", "May", "June", "July", "August", "September",
  "October", "November", "December", "January", "February", "March",
];

const METADATA_ROWS = 20; // rows 1-20 are metadata
const HEADER_ROW = 21;    // row 21 is the header

let headers = null;
const allData = [];

for (const month of MONTHS) {
  const filePath = join(DIR, `${month}.xlsx`);
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

  // Grab headers from first file
  if (!headers) {
    headers = rows[HEADER_ROW - 1]; // 0-indexed
  }

  // Data starts after header (row 22 onward, index 21)
  const dataRows = rows.slice(HEADER_ROW);

  // Filter out empty rows and the footer line
  const filtered = dataRows.filter((row) => {
    const first = String(row[0] || "").trim();
    if (!first) return false;
    if (first.startsWith("**This is a computer generated")) return false;
    return true;
  });

  console.log(`${month}: ${filtered.length} transactions`);
  allData.push(...filtered);
}

console.log(`\nTotal transactions: ${allData.length}`);

// Build output: headers + all data
const output = [headers, ...allData];

const newWB = XLSX.utils.book_new();
const newWS = XLSX.utils.aoa_to_sheet(output);

// Auto-size columns
const colWidths = headers.map((h, i) => {
  let max = String(h).length;
  for (const row of allData) {
    const len = String(row[i] || "").length;
    if (len > max) max = len;
  }
  return { wch: Math.min(max + 2, 60) };
});
newWS["!cols"] = colWidths;

XLSX.utils.book_append_sheet(newWB, newWS, "FY 2025-26");
const outPath = join(DIR, "SBI_FY_2025_26.xlsx");
XLSX.writeFile(newWB, outPath);
console.log(`\nMerged file saved: ${outPath}`);
