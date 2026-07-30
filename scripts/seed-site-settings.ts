#!/usr/bin/env npx tsx
/**
 * Seeds the site_settings table with JUSOR's real, confirmed business
 * identity (company name, address, contact details, social links). This is
 * NOT fabricated content — every value here is either:
 *   - real business data confirmed directly by the site owner, or
 *   - a design/copy choice already hardcoded as a fallback throughout the
 *     codebase (e.g. theme_color, meta description copy), now promoted to
 *     the single real settings table instead of scattered fallbacks.
 *
 * Deliberately NOT seeded: anything that would require inventing a fact
 * (founder name, founding date, review ratings, specific stats). Those stay
 * unset until the site owner provides real values.
 *
 * Usage: npx tsx scripts/seed-site-settings.ts
 */

import { pool } from '../lib/database';

type SettingType = 'text' | 'json' | 'boolean' | 'number';

const SETTINGS: Array<{ key: string; value: string; type: SettingType; description: string }> = [
  // Company identity
  { key: 'company_name', value: 'JUSOR Translation Services', type: 'text', description: 'Display name used across the site' },
  { key: 'site_url', value: 'https://jusortrans.com', type: 'text', description: 'Production site URL' },
  { key: 'company_description', value: 'Certified translation, legal translation, and interpretation services in Dubai, UAE.', type: 'text', description: 'Short company description used in meta tags' },
  { key: 'site_description', value: 'Certified translation, legal translation, and interpretation services in Dubai, UAE.', type: 'text', description: 'Alias used by some pages' },
  { key: 'company_logo', value: '/jusor.png', type: 'text', description: 'Logo path (public/jusor.png)' },
  { key: 'theme_color', value: '#e86e2a', type: 'text', description: 'Brand accent color' },

  // Contact details (confirmed real business data)
  { key: 'company_email', value: 'info@jusortrans.com', type: 'text', description: 'Primary contact email' },
  { key: 'contact_email', value: 'info@jusortrans.com', type: 'text', description: 'Alias used by some pages' },
  { key: 'company_phone', value: '+971 50 324 4329', type: 'text', description: 'Primary contact phone' },
  { key: 'phone', value: '+971 50 324 4329', type: 'text', description: 'Alias used by some pages' },
  { key: 'email', value: 'info@jusortrans.com', type: 'text', description: 'Alias used by some pages' },
  { key: 'whatsapp_number', value: '971503244329', type: 'text', description: 'WhatsApp contact number (no + or spaces)' },

  // Address (Abu Saif Business Center — confirmed 2026-07-29, replacing a stale address previously hardcoded across the codebase)
  { key: 'company_address', value: 'Abu Saif Business Center - Al-Kazim Building - Block A - M Floor - Office 40B, Abu Hail, Dubai, United Arab Emirates', type: 'text', description: 'Full office address' },
  { key: 'company_street_address', value: 'Abu Saif Business Center - Al-Kazim Building - Block A - M Floor - Office 40B', type: 'text', description: 'Street address for schema.org PostalAddress' },
  { key: 'address', value: 'Abu Saif Business Center - Al-Kazim Building - Block A - M Floor - Office 40B, Abu Hail, Dubai, United Arab Emirates', type: 'text', description: 'Alias used by some pages' },
  { key: 'company_city', value: 'Dubai', type: 'text', description: '' },
  { key: 'city', value: 'Dubai', type: 'text', description: 'Alias used by some pages' },
  { key: 'company_state', value: 'Dubai', type: 'text', description: '' },
  { key: 'state', value: 'Dubai', type: 'text', description: 'Alias used by some pages' },
  { key: 'company_country', value: 'AE', type: 'text', description: 'ISO country code' },
  { key: 'country', value: 'AE', type: 'text', description: 'Alias used by some pages' },
  { key: 'map_url', value: 'https://maps.app.goo.gl/ZKmHjsSHa66CeNjC8', type: 'text', description: 'Google Maps link (confirmed 2026-07-29)' },

  // Social links
  { key: 'linkedin_url', value: 'https://www.linkedin.com/company/jusor-translation', type: 'text', description: '' },
  { key: 'twitter_url', value: 'https://twitter.com/jusortranslation', type: 'text', description: '' },
  { key: 'facebook_url', value: 'https://www.facebook.com/jusortranslation', type: 'text', description: '' },
  { key: 'instagram_url', value: 'https://www.instagram.com/Jusor_translation', type: 'text', description: '' },
  { key: 'social_facebook', value: 'https://www.facebook.com/jusortranslation', type: 'text', description: 'Alias used by some pages' },
  { key: 'social_twitter', value: 'https://twitter.com/jusortranslation', type: 'text', description: 'Alias used by some pages' },
  { key: 'social_linkedin', value: 'https://www.linkedin.com/company/jusor-translation', type: 'text', description: 'Alias used by some pages' },
  { key: 'social_instagram', value: 'https://www.instagram.com/Jusor_translation', type: 'text', description: 'Alias used by some pages' },
  { key: 'twitter_creator', value: '@jusortranslation', type: 'text', description: '' },
  {
    key: 'social_media_links',
    type: 'json',
    description: 'Structured social links consumed by the footer component',
    value: JSON.stringify([
      { name: 'Facebook', url: 'https://www.facebook.com/jusortranslation', icon_name: 'Facebook' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/company/jusor-translation', icon_name: 'Linkedin' },
      { name: 'Instagram', url: 'https://www.instagram.com/Jusor_translation', icon_name: 'Instagram' },
      { name: 'Twitter', url: 'https://twitter.com/jusortranslation', icon_name: 'Twitter' },
    ]),
  },

  // Meta / SEO defaults (matches copy already established as fallbacks throughout the codebase)
  { key: 'meta_default_title', value: 'JUSOR Translation Services', type: 'text', description: '' },
  { key: 'meta_title_template', value: '%s | JUSOR Translation Services', type: 'text', description: '' },
  { key: 'meta_description', value: 'Certified translation, legal translation, and interpretation services in Dubai, UAE.', type: 'text', description: '' },
  { key: 'meta_author', value: 'JUSOR Translation Services', type: 'text', description: '' },
  { key: 'meta_creator', value: 'JUSOR Translation Services', type: 'text', description: '' },
  { key: 'meta_publisher', value: 'JUSOR Translation Services', type: 'text', description: '' },
  { key: 'og_image', value: '/jusor.png', type: 'text', description: '' },
  { key: 'og_image_alt', value: 'JUSOR Translation Services Logo', type: 'text', description: '' },
  { key: 'site_locale', value: 'en_US', type: 'text', description: '' },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let inserted = 0;
    let updated = 0;
    for (const s of SETTINGS) {
      const res = await client.query(
        `INSERT INTO site_settings (setting_key, setting_value, setting_type, description, is_active)
         VALUES ($1, $2, $3, $4, true)
         ON CONFLICT (setting_key) DO UPDATE SET
           setting_value = EXCLUDED.setting_value,
           setting_type = EXCLUDED.setting_type,
           updated_at = CURRENT_TIMESTAMP
         RETURNING (xmax = 0) AS inserted`,
        [s.key, s.value, s.type, s.description]
      );
      if (res.rows[0].inserted) inserted++; else updated++;
    }
    await client.query('COMMIT');
    console.log(`✅ site_settings seeded: ${inserted} inserted, ${updated} updated (${SETTINGS.length} total keys).`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to seed site_settings:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
