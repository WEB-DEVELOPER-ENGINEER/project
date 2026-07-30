#!/usr/bin/env npx tsx
/**
 * Seeds the header_items and top_bar_items tables with default navigation menus.
 * 
 * Usage: npx tsx scripts/seed-navigation.ts
 */

import { pool } from '../lib/database';

const HEADER_ITEMS = [
  { name: 'Home', link: '/', sort_order: 1 },
  { name: 'About Us', link: '/about', sort_order: 2 },
  { name: 'Services', link: '/services', sort_order: 3 },
  { name: 'Projects', link: '/projects', sort_order: 4 },
  { name: 'Blog', link: '/blog', sort_order: 5 },
  { name: 'Contact', link: '/contact', sort_order: 6 },
];

const TOP_BAR_ITEMS = [
  { name: 'Phone', link: 'tel:+971503244329', icon_name: 'Phone', sort_order: 1 },
  { name: 'Email', link: 'mailto:info@jusortrans.com', icon_name: 'Mail', sort_order: 2 },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Seed Header Items
    let headerInserted = 0;
    let headerSkipped = 0;
    for (const item of HEADER_ITEMS) {
      const existing = await client.query('SELECT id FROM header_items WHERE link = $1', [item.link]);
      if (existing.rows.length > 0) {
        headerSkipped++;
        continue;
      }
      await client.query(
        'INSERT INTO header_items (name, link, sort_order, is_active) VALUES ($1, $2, $3, true)',
        [item.name, item.link, item.sort_order]
      );
      headerInserted++;
    }

    // 2. Seed Top Bar Items
    let topBarInserted = 0;
    let topBarSkipped = 0;
    for (const item of TOP_BAR_ITEMS) {
      const existing = await client.query('SELECT id FROM top_bar_items WHERE link = $1', [item.link]);
      if (existing.rows.length > 0) {
        topBarSkipped++;
        continue;
      }
      
      // Get icon_id
      const iconRes = await client.query('SELECT id FROM icons WHERE name = $1', [item.icon_name]);
      const iconId = iconRes.rows.length > 0 ? iconRes.rows[0].id : null;

      await client.query(
        'INSERT INTO top_bar_items (name, link, icon_id, sort_order, is_active) VALUES ($1, $2, $3, $4, true)',
        [item.name, item.link, iconId, item.sort_order]
      );
      topBarInserted++;
    }

    await client.query('COMMIT');
    console.log(`✅ header_items seeded: ${headerInserted} inserted, ${headerSkipped} skipped.`);
    console.log(`✅ top_bar_items seeded: ${topBarInserted} inserted, ${topBarSkipped} skipped.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to seed navigation items:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
