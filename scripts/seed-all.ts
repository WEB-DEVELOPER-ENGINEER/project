#!/usr/bin/env npx tsx
/**
 * Runs all content seed scripts in sequence: site settings, service
 * catalog, then blog articles. Each individual script is also runnable on
 * its own (see package.json db:seed-* scripts).
 *
 * Usage: npx tsx scripts/seed-all.ts
 */

import { execSync } from 'child_process';

const scripts = [
  'scripts/seed-site-settings.ts',
  'scripts/seed-navigation.ts',
  'scripts/seed-services.ts',
  'scripts/seed-articles.ts',
];

for (const script of scripts) {
  console.log(`\n=== Running ${script} ===`);
  execSync(`npx tsx ${script}`, { stdio: 'inherit' });
}

console.log('\n✅ All seed scripts completed.');
