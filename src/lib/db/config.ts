import type { DataMode } from '@/types/db';

export const DB_KEY = 'TRUTH_APP_DB';
export const DB_VERSION_KEY = 'TRUTH_APP_DB_VERSION';
export const CURRENT_DB_VERSION = 2;
export const MAX_EVENTS = 20_000;

export const DATA_MODE: DataMode = 'local';
