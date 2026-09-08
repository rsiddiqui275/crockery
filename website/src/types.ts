export type PriceMode = 'retail' | 'wholesale';

export interface Product {
  id: string;
  name: string;
  category: string;
  sizeMl?: number;
  colour?: string;
  material?: string;
  retailPrice: number;
  wholesalePrice: number;
  moq?: number;
  description?: string;
  image: string;
  video?: string;
  inStock: boolean;
}

export interface EnquiryItem {
  product: Product;
  qty: number;
}
