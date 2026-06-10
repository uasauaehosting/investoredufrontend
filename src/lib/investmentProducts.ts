export interface InvestmentProductSubItem {
  title: string;
  text: string;
}

export interface InvestmentProductBlock {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  subItems?: InvestmentProductSubItem[];
  source?: string;
  externalLink?: { label: string; url: string };
}

export interface InvestmentProductItem {
  id: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  author: string;
  date: string;
  fileUrl: string;
  imageUrl: string;
  content: string;
  contentAr?: string;
  slug?: string;
  isActive: boolean;
}

export const INVESTMENT_PRODUCTS_LIST_PATH = '/education/reading-materials/products';

export function investmentProductDetailPath(id: number): string {
  return `${INVESTMENT_PRODUCTS_LIST_PATH}/${id}`;
}
