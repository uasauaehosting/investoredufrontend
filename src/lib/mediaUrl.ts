const DEFAULT_UPLOADS_BASE = 'https://ahwuae.com/investorupload/uploads';

function getUploadsBase(): string {
  const configured = import.meta.env.VITE_UPLOADS_BASE_URL;
  if (configured) {
    return String(configured).replace(/\/$/, '');
  }
  return DEFAULT_UPLOADS_BASE;
}

const REWRITE_RULES: RegExp[] = [
  /^https?:\/\/ahwuae\.com\/investoredu\/investoredu\/uploads\/(.+)$/i,
  /^https?:\/\/ahwuae\.com\/investoredu\/uploads\/(.+)$/i,
  /^https?:\/\/investoreducation\.uasa\.ae\/uploads\/(.+)$/i,
  /^https?:\/\/uasa\.ae\/en\/galorg\/(.+)$/i,
  /^https?:\/\/uasa\.ae\/en\/galimg\/(.+)$/i,
];

const MEDIA_FIELD_KEYS = new Set([
  'image_url',
  'imageUrl',
  'file_url',
  'fileUrl',
  'pdfUrl',
  'heroImage',
  'backgroundImage',
  'image',
  'logo',
  'pdfFile',
]);

function looksLikeMediaUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return false;
  }
  return /uploads\/|galorg\/|galimg\/|\.(jpe?g|png|gif|webp|svg|pdf)(\?|$)/i.test(trimmed);
}

function extractFilename(urlPath: string): string {
  return decodeURIComponent(urlPath.split('?')[0].split('/').pop() || urlPath);
}

/** Map legacy upload URLs to the Hostinger uploads base for previews and display. */
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

/** Normalize known media URL fields in admin records and nested site content. */
export function normalizeMediaFieldsDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return (looksLikeMediaUrl(value) ? normalizeMediaUrl(value) : value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeMediaFieldsDeep(item)) as T;
  }

  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      if (typeof nested === 'string' && MEDIA_FIELD_KEYS.has(key)) {
        out[key] = normalizeMediaUrl(nested);
      } else {
        out[key] = normalizeMediaFieldsDeep(nested);
      }
    }
    return out as T;
  }

  return value;
}
