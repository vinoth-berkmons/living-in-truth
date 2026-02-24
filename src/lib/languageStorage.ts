import { LANGUAGE_META, type Language } from '@/types/entities';

const STORAGE_KEY = 'LIT_LANG_BY_HOST';

export function normalizeHostname(hostname: string): string {
  let h = hostname.toLowerCase();
  // Remove port
  const colonIdx = h.indexOf(':');
  if (colonIdx !== -1) h = h.slice(0, colonIdx);
  // Strip trailing dot
  if (h.endsWith('.')) h = h.slice(0, -1);
  // Strip www. prefix
  if (h.startsWith('www.')) h = h.slice(4);
  return h;
}

function readMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getStoredLanguage(hostname: string): Language | null {
  const map = readMap();
  const val = map[normalizeHostname(hostname)];
  if (val && val in LANGUAGE_META) return val as Language;
  return null;
}

export function setStoredLanguage(hostname: string, lang: Language): void {
  const map = readMap();
  map[normalizeHostname(hostname)] = lang;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage full or unavailable
  }
}
