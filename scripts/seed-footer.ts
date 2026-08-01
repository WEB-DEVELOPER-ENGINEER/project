#!/usr/bin/env npx tsx
/**
 * Seeds the footer_sections and footer_links tables.
 * 
 * Usage: npx tsx scripts/seed-footer.ts
 */

import { pool } from '../lib/database';

const SECTIONS = [
  { id: 1, title: 'Services', section_type: 'main', sort_order: 1 },
  { id: 2, title: 'Company', section_type: 'legal', sort_order: 2 },
];

const LINKS = [
  { footer_section_id: 1, name: 'Legal Translation', url: '/services', sort_order: 1 },
  { footer_section_id: 1, name: 'Technical Translation', url: '/services', sort_order: 2 },
  { footer_section_id: 1, name: 'Business Translation', url: '/services', sort_order: 3 },
  { footer_section_id: 2, name: 'About Us', url: '/about', sort_order: 1 },
  { footer_section_id: 2, name: 'Contact Us', url: '/contact', sort_order: 2 },
  { footer_section_id: 2, name: 'Privacy Policy', url: '/privacy', sort_order: 3 },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Seed Footer Sections
    let sectionInserted = 0;
    let sectionSkipped = 0;
    for (const section of SECTIONS) {
      const existing = await client.query('SELECT id FROM footer_sections WHERE id = $1', [section.id]);
      if (existing.rows.length > 0) {
        sectionSkipped++;
        continue;
      }
      await client.query(
        'INSERT INTO footer_sections (id, title, section_type, sort_order, is_active) VALUES ($1, $2, $3, $4, true)',
        [section.id, section.title, section.section_type, section.sort_order]
      );
      sectionInserted++;
    }

    // Reset primary key sequence for footer_sections
    await client.query("SELECT setval('footer_sections_id_seq', (SELECT MAX(id) FROM footer_sections))");

    // 2. Seed Footer Links
    let linkInserted = 0;
    let linkSkipped = 0;
    for (const link of LINKS) {
      const existing = await client.query(
        'SELECT id FROM footer_links WHERE footer_section_id = $1 AND name = $2',
        [link.footer_section_id, link.name]
      );
      if (existing.rows.length > 0) {
        linkSkipped++;
        continue;
      }
      await client.query(
        'INSERT INTO footer_links (footer_section_id, name, url, sort_order, is_active) VALUES ($1, $2, $3, $4, true)',
        [link.footer_section_id, link.name, link.url, link.sort_order]
      );
      linkInserted++;
    }

    await client.query('COMMIT');
    console.log(`✅ footer_sections seeded: ${sectionInserted} inserted, ${sectionSkipped} skipped.`);
    console.log(`✅ footer_links seeded: ${linkInserted} inserted, ${linkSkipped} skipped.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to seed footer items:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
