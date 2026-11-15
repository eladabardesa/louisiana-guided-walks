export function formatPriceDkk(ore: number): string {
  if (ore === 0) return 'Free';
  const dkk = ore / 100;
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    maximumFractionDigits: dkk % 1 === 0 ? 0 : 2,
  }).format(dkk);
}

export function formatTourDate(date: Date | string, language?: string | null): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const datePart = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
  const timePart = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
  const lang = language ? ` · ${language}` : '';
  return `${datePart} · ${timePart}${lang}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateOrderNumber(): string {
  const now = new Date();
  const stamp = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `AAE-${stamp}-${rand}`;
}

export type GalleryImage = { src: string; alt: string };

export function parseGalleryImages(value: unknown): GalleryImage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is GalleryImage =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as GalleryImage).src === 'string' &&
        typeof (item as GalleryImage).alt === 'string'
    )
    .map((item) => ({ src: item.src, alt: item.alt || '' }));
}
