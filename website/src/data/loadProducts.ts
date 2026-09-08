import Papa from 'papaparse';
import type { Product } from '../types';
import { sampleProducts } from './sampleProducts';

const SHEET_URL = import.meta.env.VITE_PRODUCTS_CSV_URL as string | undefined;
const EXCEL_URL = (import.meta.env.VITE_PRODUCTS_XLSX_URL as string | undefined) || '/products.xlsx';

function toNum(v: string | undefined): number {
  const n = Number(String(v ?? '').trim());
  return Number.isFinite(n) ? n : 0;
}

function toOptionalNum(v: string | undefined): number | undefined {
  const trimmed = String(v ?? '').trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

function toBool(v: string | undefined): boolean {
  const trimmed = String(v ?? '').trim().toLowerCase();
  return trimmed !== 'false' && trimmed !== '0' && trimmed !== 'no';
}

function rowToProduct(row: Record<string, string>, index: number): Product {
  const retailPrice = toNum(row.retailPrice ?? row.price);
  return {
    id: row.id?.trim() || `sheet-${index + 1}`,
    name: row.name?.trim() || `Product ${index + 1}`,
    category: row.category?.trim() || 'Uncategorized',
    sizeMl: toOptionalNum(row.sizeMl),
    colour: row.colour?.trim() || row.color?.trim() || undefined,
    material: row.material?.trim() || 'Glass',
    retailPrice,
    wholesalePrice: toOptionalNum(row.wholesalePrice) ?? retailPrice,
    moq: toOptionalNum(row.moq),
    description: row.description?.trim() || undefined,
    image: row.image?.trim() || '',
    video: row.video?.trim() || undefined,
    inStock: row.inStock === undefined ? true : toBool(row.inStock),
  };
}

export interface LoadProductsResult {
  products: Product[];
  source: 'sheet' | 'excel' | 'sample';
  error?: string;
}

function rowsToProducts(rows: Record<string, string>[]): Product[] {
  return rows
    .filter((row) => row && Object.values(row).some((val) => String(val ?? '').trim() !== ''))
    .map((row, i) => rowToProduct(row, i))
    .filter((p) => p.name && p.image);
}

/**
 * Loads the product catalog. Priority order:
 * 1. VITE_PRODUCTS_CSV_URL (a Google Sheet published as CSV, or any URL serving CSV text).
 * 2. The bundled/deployed Excel file at public/products.xlsx (or VITE_PRODUCTS_XLSX_URL).
 *    Edit this file, push to GitHub, and the next deploy will pick up the changes.
 * 3. The bundled sample data, so the site always has something to show.
 */
export async function loadProducts(): Promise<LoadProductsResult> {
  if (SHEET_URL) {
    try {
      const res = await fetch(SHEET_URL, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Sheet request failed with status ${res.status}`);
      }
      const csvText = await res.text();
      const parsed = Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      const products = rowsToProducts(parsed.data);
      if (products.length === 0) {
        throw new Error('Sheet was reachable but contained no usable rows (check the "name" and "image" columns)');
      }

      return { products, source: 'sheet' };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[Crokary] Falling back because the sheet could not be loaded:', message);
    }
  }

  try {
    const res = await fetch(EXCEL_URL, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Excel file request failed with status ${res.status}`);
    }
    const buffer = await res.arrayBuffer();
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '', raw: false });

    const products = rowsToProducts(rows);
    if (products.length === 0) {
      throw new Error('products.xlsx was reachable but contained no usable rows (check the "name" and "image" columns)');
    }

    return { products, source: 'excel' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Crokary] Falling back to sample products because products.xlsx could not be loaded:', message);
    return { products: sampleProducts, source: 'sample', error: message };
  }
}
