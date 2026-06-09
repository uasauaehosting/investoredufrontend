export interface Principle {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  fileUrl: string;
  imageUrl: string;
  content: string;
  isActive: boolean;
}

export const PRINCIPLES_LIST_PATH = '/education/reading-materials/principles';

export function principleDetailPath(id: number): string {
  return `${PRINCIPLES_LIST_PATH}/${id}`;
}
