import Papa from 'papaparse';
import type { Product } from '../types';
import { sampleProducts } from './sampleProducts';

const SHEET_URL = import.meta.env.VITE_PRODUCTS_CSV_URL as string | undefined;

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
  source: 'sheet' | 'sample';
  error?: string;
}

/**
 * Loads the product catalog. If VITE_PRODUCTS_CSV_URL is configured (a Google Sheet
 * published as CSV, or any URL serving CSV text), it is fetched and parsed. Otherwise,
 * falls back to the bundled sample data so the site always has something to show.
 */
export async function loadProducts(): Promise<LoadProductsResult> {
  if (!SHEET_URL) {
    return { products: sampleProducts, source: 'sample' };
  }

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

    const products = parsed.data
      .filter((row) => row && Object.values(row).some((val) => String(val ?? '').trim() !== ''))
      .map((row, i) => rowToProduct(row, i))
      .filter((p) => p.name && p.image);

    if (products.length === 0) {
      throw new Error('Sheet was reachable but contained no usable rows (check the "name" and "image" columns)');
    }

    return { products, source: 'sheet' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Crokary] Falling back to sample products because the sheet could not be loaded:', message);
    return { products: sampleProducts, source: 'sample', error: message };
  }
}
