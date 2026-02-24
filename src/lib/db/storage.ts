import type { AppDatabase } from '@/types/db';
import { DB_KEY, DB_VERSION_KEY, CURRENT_DB_VERSION } from './config';

export function getDB(): AppDatabase | null {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return null;
    const db = JSON.parse(raw) as AppDatabase;
    const storedVersion = localStorage.getItem(DB_VERSION_KEY);
    if (Number(storedVersion) !== CURRENT_DB_VERSION) return null;
    return db;
  } catch {
    return null;
  }
}

export function setDB(db: AppDatabase): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  localStorage.setItem(DB_VERSION_KEY, String(db.version));
}

export function updateDB(updater: (db: AppDatabase) => AppDatabase): AppDatabase {
  const current = getDB();
  if (!current) throw new Error('Database not initialized');
  const updated = updater(current);
  setDB(updated);
  return updated;
}
