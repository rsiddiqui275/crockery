import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { EnquiryItem, PriceMode, Product } from '../types';
import { loadProducts } from '../data/loadProducts';

const PRICE_MODE_KEY = 'crokary.priceMode';
const ENQUIRY_KEY = 'crokary.enquiry';

export const BUSINESS_NAME = (import.meta.env.VITE_BUSINESS_NAME as string) || 'Crokary';
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || '';

interface StoreContextValue {
  products: Product[];
  productsLoading: boolean;
  productsSource: 'sheet' | 'excel' | 'sample' | null;
  productsError?: string;
  priceMode: PriceMode;
  setPriceMode: (mode: PriceMode) => void;
  enquiryItems: EnquiryItem[];
  addToEnquiry: (product: Product, qty?: number) => void;
  removeFromEnquiry: (productId: string) => void;
  setEnquiryQty: (productId: string, qty: number) => void;
  clearEnquiry: () => void;
  enquiryCount: number;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function readStoredEnquiry(products: Product[]): EnquiryItem[] {
  try {
    const raw = localStorage.getItem(ENQUIRY_KEY);
    if (!raw) return [];
    const parsed: { productId: string; qty: number }[] = JSON.parse(raw);
    return parsed
      .map(({ productId, qty }) => {
        const product = products.find((p) => p.id === productId);
        return product ? { product, qty } : null;
      })
      .filter((x): x is EnquiryItem => x !== null);
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsSource, setProductsSource] = useState<'sheet' | 'excel' | 'sample' | null>(null);
  const [productsError, setProductsError] = useState<string | undefined>(undefined);

  const [priceMode, setPriceModeState] = useState<PriceMode>(() => {
    const stored = localStorage.getItem(PRICE_MODE_KEY);
    return stored === 'wholesale' ? 'wholesale' : 'retail';
  });

  const [enquiryItems, setEnquiryItems] = useState<EnquiryItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadProducts().then((result) => {
      if (cancelled) return;
      setProducts(result.products);
      setProductsSource(result.source);
      setProductsError(result.error);
      setProductsLoading(false);
      setEnquiryItems(readStoredEnquiry(result.products));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setPriceMode = useCallback((mode: PriceMode) => {
    setPriceModeState(mode);
    localStorage.setItem(PRICE_MODE_KEY, mode);
  }, []);

  const persistEnquiry = useCallback((items: EnquiryItem[]) => {
    localStorage.setItem(
      ENQUIRY_KEY,
      JSON.stringify(items.map(({ product, qty }) => ({ productId: product.id, qty }))),
    );
  }, []);

  const addToEnquiry = useCallback(
    (product: Product, qty = 1) => {
      setEnquiryItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        const next = existing
          ? prev.map((item) =>
              item.product.id === product.id ? { ...item, qty: item.qty + qty } : item,
            )
          : [...prev, { product, qty }];
        persistEnquiry(next);
        return next;
      });
    },
    [persistEnquiry],
  );

  const removeFromEnquiry = useCallback(
    (productId: string) => {
      setEnquiryItems((prev) => {
        const next = prev.filter((item) => item.product.id !== productId);
        persistEnquiry(next);
        return next;
      });
    },
    [persistEnquiry],
  );

  const setEnquiryQty = useCallback(
    (productId: string, qty: number) => {
      setEnquiryItems((prev) => {
        const next = prev.map((item) =>
          item.product.id === productId ? { ...item, qty: Math.max(1, qty) } : item,
        );
        persistEnquiry(next);
        return next;
      });
    },
    [persistEnquiry],
  );

  const clearEnquiry = useCallback(() => {
    setEnquiryItems([]);
    persistEnquiry([]);
  }, [persistEnquiry]);

  const enquiryCount = useMemo(
    () => enquiryItems.reduce((sum, item) => sum + item.qty, 0),
    [enquiryItems],
  );

  const value: StoreContextValue = {
    products,
    productsLoading,
    productsSource,
    productsError,
    priceMode,
    setPriceMode,
    enquiryItems,
    addToEnquiry,
    removeFromEnquiry,
    setEnquiryQty,
    clearEnquiry,
    enquiryCount,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
