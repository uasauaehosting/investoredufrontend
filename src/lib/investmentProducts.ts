export interface InvestmentProduct {
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
  isActive: boolean;
}

export const INVESTMENT_PRODUCTS_LIST_PATH = '/education/reading-materials/products';

export function investmentProductDetailPath(id: number): string {
  return `${INVESTMENT_PRODUCTS_LIST_PATH}/${id}`;
}
