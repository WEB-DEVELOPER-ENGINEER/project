#!/usr/bin/env npx tsx
/**
 * Seeds the clients table with JUSOR's real client roster, as provided
 * directly by the site owner from the company's corporate profile. No logos
 * are seeded (none were provided) — the client name is used as the display
 * title; add real logos via the admin panel when available.
 *
 * Usage: npx tsx scripts/seed-clients.ts
 */

import { pool } from '../lib/database';

const CLIENTS = [
  'EMAAR',
  'Al Futtaim Group',
  'Aster DM Healthcare',
  'Carrefour',
  'Invest Bank',
  'Sharjah Documentation & Archiving Authority',
  'Rafid',
  'Khorfakkan Club',
  'AAAID',
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let inserted = 0;
    let skipped = 0;

    for (let i = 0; i < CLIENTS.length; i++) {
      const name = CLIENTS[i];
      const existing = await client.query('SELECT id FROM clients WHERE title = $1', [name]);
      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }
      await client.query(
        `INSERT INTO clients (title, description, sort_order, is_active) VALUES ($1, $2, $3, true)`,
        [name, '', i]
      );
      inserted++;
    }

    await client.query('COMMIT');
    console.log(`✅ clients seeded: ${inserted} inserted, ${skipped} already present (${CLIENTS.length} total).`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to seed clients:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
