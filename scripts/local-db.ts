/**
 * Local development database control script.
 *
 * Spins up a real, persistent PostgreSQL instance on this machine using the
 * `embedded-postgres` npm package (downloads a real Postgres binary via npm/
 * Maven Central — no system installer, no Docker required). Intended purely
 * for local development before switching to the production VPS database.
 *
 * Usage:
 *   npx tsx scripts/local-db.ts start   # start (init on first run), then create schema
 *   npx tsx scripts/local-db.ts stop    # stop the local server
 *   npx tsx scripts/local-db.ts status  # check if it's running
 *
 * To point the app at this local DB, set in .env.local:
 *   DATABASE_URL=postgresql://postgres:postgres@localhost:55432/jusor_nextjs
 *
 * To switch to the VPS later, just change DATABASE_URL (or DB_HOST/DB_PORT/
 * DB_NAME/DB_USER/DB_PASSWORD) back — nothing else in the app needs to change.
 */

import EmbeddedPostgres from 'embedded-postgres';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(__dirname, '..', '.localdb', 'pgdata');
const PORT = 55432;
const DB_NAME = 'jusor_nextjs';
const USER = 'postgres';
const PASSWORD = 'postgres';

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: USER,
  password: PASSWORD,
  port: PORT,
  persistent: true,
});

async function ensureSchema() {
  process.env.DATABASE_URL = `postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DB_NAME}`;
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = String(PORT);
  process.env.DB_NAME = DB_NAME;
  process.env.DB_USER = USER;
  process.env.DB_PASSWORD = PASSWORD;

  // Import lazily so env vars above are set before lib/database.ts builds its pool
  const { initializeDatabase } = await import('../lib/database');
  await initializeDatabase();
  console.log(`Schema ready in database "${DB_NAME}".`);
}

async function main() {
  const cmd = process.argv[2];

  if (cmd === 'status') {
    console.log(fs.existsSync(DATA_DIR) ? 'Local DB data directory exists.' : 'Local DB not initialised yet.');
    return;
  }

  if (cmd === 'stop') {
    await pg.start().catch(() => {}); // embedded-postgres requires a start handle to stop cleanly
    await pg.stop();
    console.log('Local Postgres stopped.');
    return;
  }

  if (cmd === 'start' || !cmd) {
    const firstRun = !fs.existsSync(DATA_DIR);
    if (firstRun) {
      console.log('First run: initialising local Postgres data directory...');
      await pg.initialise();
    }
    await pg.start();
    console.log(`Local Postgres running at postgresql://${USER}:${PASSWORD}@localhost:${PORT}/postgres`);

    if (firstRun) {
      console.log(`Creating database "${DB_NAME}" (UTF8, so Arabic content and emoji store correctly regardless of this machine's OS locale)...`);
      const client = pg.getPgClient();
      await client.connect();
      await client.query(
        `CREATE DATABASE "${DB_NAME}" WITH ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0`
      );
      await client.end();
    }

    await ensureSchema();
    console.log('\nLocal DB is ready. Set this in .env.local:');
    console.log(`DATABASE_URL=postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DB_NAME}`);
    console.log('\n(Leave this process running — press Ctrl+C to stop the local DB.)');

    // Keep the process alive so the server stays up for local dev
    process.stdin.resume();
    process.on('SIGINT', async () => {
      console.log('\nStopping local Postgres...');
      await pg.stop();
      process.exit(0);
    });
    return;
  }

  console.error(`Unknown command: ${cmd}. Use "start", "stop", or "status".`);
  process.exit(1);
}

main().catch((err) => {
  console.error('local-db script failed:', err);
  process.exit(1);
});
