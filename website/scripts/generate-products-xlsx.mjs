// One-off/reusable script: converts public/products.csv into public/products.xlsx
// Run with: node scripts/generate-products-xlsx.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const csvPath = join(__dirname, '..', 'public', 'products.csv');
const xlsxPath = join(__dirname, '..', 'public', 'products.xlsx');

const csvText = readFileSync(csvPath, 'utf-8');
const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

const worksheet = XLSX.utils.json_to_sheet(parsed.data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
writeFileSync(xlsxPath, buffer);

console.log(`Wrote ${parsed.data.length} rows to ${xlsxPath}`);
