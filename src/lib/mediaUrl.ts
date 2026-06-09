const DEFAULT_UPLOADS_BASE = 'https://apiinvestoredu.ahwuae.com/uploads';

function getUploadsBase(): string {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  if (apiUrl) {
    return apiUrl.replace(/\/api\/?$/, '') + '/uploads';
  }
  return DEFAULT_UPLOADS_BASE;
}

const REWRITE_RULES: RegExp[] = [
  /^https?:\/\/ahwuae\.com\/investoredu\/uploads\/(.+)$/i,
  /^https?:\/\/investoreducation\.uasa\.ae\/uploads\/(.+)$/i,
  /^https?:\/\/uasa\.ae\/en\/galorg\/(.+)$/i,
  /^https?:\/\/uasa\.ae\/en\/galimg\/(.+)$/i,
];

function extractFilename(urlPath: string): string {
  return decodeURIComponent(urlPath.split('?')[0].split('/').pop() || urlPath);
}

/** Map legacy/broken upload URLs to the API uploads base for previews and display. */
export function normalizeMediaUrl(url: string | null | undefined): string {
  if (!url) return '';

  const trimmed = url.trim();
  const base = getUploadsBase().replace(/\/$/, '');

  if (trimmed.startsWith(base + '/')) {
    return trimmed.replace(/^http:\/\//i, 'https://');
  }

  for (const pattern of REWRITE_RULES) {
    const match = trimmed.match(pattern);
    if (match) {
      return `${base}/${extractFilename(match[1])}`;
    }
  }

  return trimmed;
}
