export interface Framework {
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

export const FRAMEWORK_LIST_PATH = '/education/reading-materials/framework';

export function frameworkDetailPath(id: number): string {
  return `${FRAMEWORK_LIST_PATH}/${id}`;
}
