interface LegacyBlock {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  subItems?: { title: string; text: string }[];
  source?: string;
  externalLink?: { label: string; url: string };
}

function parseLegacyBlocks(content: string | undefined): LegacyBlock[] {
  if (!content?.trim()) return [];

  try {
    const parsed = JSON.parse(content);
    if (parsed?.blocks && Array.isArray(parsed.blocks)) return parsed.blocks;
    if (Array.isArray(parsed)) return parsed;
  } catch {
    return [];
  }

  return [];
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function blocksToHtml(blocks: LegacyBlock[]): string {
  return blocks
    .map((block) => {
      const parts: string[] = [];
      if (block.heading) parts.push(`<h3>${escapeHtml(block.heading)}</h3>`);
      block.paragraphs?.forEach((p) => parts.push(`<p>${escapeHtml(p)}</p>`));
      block.subItems?.forEach((item) => {
        parts.push(`<h4>${escapeHtml(item.title)}</h4>`);
        parts.push(`<p>${escapeHtml(item.text)}</p>`);
      });
      if (block.bullets?.length) {
        parts.push('<ul>');
        block.bullets.forEach((b) => parts.push(`<li>${escapeHtml(b)}</li>`));
        parts.push('</ul>');
      }
      if (block.source) parts.push(`<p><em>${escapeHtml(block.source)}</em></p>`);
      if (block.externalLink?.url) {
        const label = escapeHtml(block.externalLink.label || 'Read more');
        parts.push(
          `<p><a href="${escapeHtml(block.externalLink.url)}" target="_blank" rel="noopener noreferrer">${label}</a></p>`,
        );
      }
      return parts.join('\n');
    })
    .join('\n\n');
}

/** Converts legacy JSON block content to HTML; returns HTML content unchanged. */
export function normalizeInvestmentProductContent(content: string | undefined): string {
  if (!content?.trim()) return '';
  const trimmed = content.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return content;

  const blocks = parseLegacyBlocks(content);
  return blocks.length > 0 ? blocksToHtml(blocks) : content;
}
