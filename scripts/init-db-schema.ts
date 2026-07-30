#!/usr/bin/env npx tsx
/**
 * Initializes the database schema (all CREATE TABLE / ALTER statements from
 * lib/database.ts) against whatever database is configured via env vars
 * (DATABASE_URL, or DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD).
 *
 * Works against both the local embedded dev database (after `npm run
 * db:local`) and a real production database — same schema, same script.
 *
 * Usage: npx tsx scripts/init-db-schema.ts
 */

import { initializeDatabase, pool } from '../lib/database';

async function main() {
  console.log('Initializing database schema...');
  await initializeDatabase();
  console.log('✅ Schema ready.');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Failed to initialize schema:', err);
  process.exit(1);
});
