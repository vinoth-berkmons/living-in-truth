import { getDB, setDB } from './storage';
import { migrateDB } from './migrate';
import { SEED_DB_V1 } from './seed_db_v1';
import { CURRENT_DB_VERSION } from './config';

/**
 * Initialize the database. Seeds on first load or version mismatch.
 * Returns the ready database.
 */
export function initDB() {
  let db = getDB();

  if (!db || db.version !== CURRENT_DB_VERSION) {
    // Seed fresh
    db = { ...SEED_DB_V1 };
    setDB(db);
    return db;
  }

  // Run any pending migrations
  db = migrateDB(db);
  setDB(db);
  return db;
}
