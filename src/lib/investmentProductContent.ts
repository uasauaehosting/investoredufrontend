import { InvestmentProductBlock } from './investmentProducts';

export function parseInvestmentProductContent(content: string | undefined): InvestmentProductBlock[] {
  if (!content?.trim()) return [];

  try {
    const parsed = JSON.parse(content);
    if (parsed?.blocks && Array.isArray(parsed.blocks)) return parsed.blocks;
    if (Array.isArray(parsed)) return parsed;
  } catch {
    return [{ paragraphs: [content.trim()] }];
  }

  return [];
}

export function serializeInvestmentProductContent(blocks: InvestmentProductBlock[]): string {
  return JSON.stringify({ blocks });
}
