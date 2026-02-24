import type { AppDatabase } from '@/types/db';

/**
 * Run migrations on the DB if needed.
 * Phase 0: no migrations yet — scaffold for future use.
 */
export function migrateDB(db: AppDatabase): AppDatabase {
  // Future migrations go here as version checks
  // e.g. if (db.version < 2) { db = migrateV1toV2(db); }
  return db;
}
