#!/usr/bin/env npx tsx
/**
 * Links existing English and Arabic blog articles that cover the same real
 * topic, by setting a shared `translation_group` (the English post's own
 * slug) on both rows — used for hreflang alternates (see
 * getBlogPostTranslation in lib/data-access.ts).
 *
 * These are the 31 articles already seeded from real source .docx files
 * (see scripts/seed-articles.ts) — this script does not translate or
 * generate any new content, it only records which existing pairs cover the
 * same subject. One English article ("Certified Legal Translation for
 * Immigration and Golden Visa Procedures") has no Arabic counterpart in the
 * current article set, so it's intentionally left unlinked — it will show
 * as English-only (no hreflang alternate) until a real Arabic version
 * exists.
 *
 * Usage: npx tsx scripts/link-blog-translations.ts
 */

import { pool } from '../lib/database';

// [englishPostId, arabicPostId] — matched by reading both articles' actual
// titles/subject matter (see conversation history for the full mapping
// verification).
const PAIRS: Array<[number, number]> = [
  [1, 20],  // Commercial Franchise / Exclusive Agencies / Distribution Disputes
  [2, 18],  // Corporate Governance / Regulatory Compliance / Anti-Bribery
  [3, 17],  // Corporate Restructuring / Insolvency / Bankruptcy
  [4, 21],  // Employment Contracts / HR Regulations / Labor Disputes
  [6, 23],  // Insurance / Reinsurance / Megaclaims
  [7, 24],  // International Commercial Arbitration / DIAC
  [8, 31],  // Real Estate Mortgages and Banking Documents
  [9, 19],  // Statements of Claim / Defense Briefs / Court Judgments
  [10, 22], // Wealth Management / Sovereign Wealth Funds / Trusts
  [11, 28], // Corporate Tax / VAT / FTA Compliance
  [12, 25], // Sustainability / ESG / Green Regulatory Compliance
  [13, 27], // Aviation Contracts / Aircraft Leasing
  [14, 26], // Energy / Oil & Gas / Renewable Energy
  [15, 30], // Dubai Tourist Visa Applications
  [16, 29], // MOFA & MOJ Attestation Guide
  // Post 5 (Immigration and Golden Visa) intentionally has no Arabic match yet.
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let linked = 0;
    for (const [enId, arId] of PAIRS) {
      const enRes = await client.query('SELECT slug, title FROM blog_posts WHERE id = $1', [enId]);
      if (enRes.rows.length === 0) {
        console.warn(`  ⚠️  English post id=${enId} not found, skipping pair`);
        continue;
      }
      const groupKey = enRes.rows[0].slug;

      const res = await client.query(
        'UPDATE blog_posts SET translation_group = $1 WHERE id IN ($2, $3)',
        [groupKey, enId, arId]
      );
      if (res.rowCount === 2) {
        linked++;
        console.log(`  ✔ Linked id=${enId} <-> id=${arId} (${enRes.rows[0].title.slice(0, 60)}...)`);
      } else {
        console.warn(`  ⚠️  Expected to update 2 rows for pair (${enId}, ${arId}), updated ${res.rowCount}`);
      }
    }
    await client.query('COMMIT');
    console.log(`\n✅ ${linked} / ${PAIRS.length} translation pairs linked.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to link blog translations:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
