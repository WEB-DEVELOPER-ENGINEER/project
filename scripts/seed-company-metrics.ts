#!/usr/bin/env npx tsx
/**
 * Seeds company_metrics with REAL, verified JUSOR facts provided directly
 * by the site owner (2026, from the company's own corporate profile) —
 * years in business, client count, languages covered, and the company's
 * actual accreditations (ISO 9001:2015, UAE Ministry of Justice, Dubai
 * Courts, DIFC Courts, DIAC, and other regulatory bodies). These replace
 * the placeholder/generic fallback text that was previously hardcoded in
 * components (which never asserted a specific certification/number for
 * publish, only used as UI defaults when the DB had nothing).
 *
 * Usage: npx tsx scripts/seed-company-metrics.ts
 */

import { pool } from '../lib/database';

interface MetricSeed {
  metric_key: string;
  metric_value: string;
  metric_label: string;
  metric_description?: string;
  category: 'stats' | 'achievements' | 'benefits';
  icon_name: string;
  color_class: string;
  display_order: number;
  locale: string;
}

const METRICS: MetricSeed[] = [
  // Stats
  { metric_key: 'years_experience', metric_value: '15+', metric_label: 'Years of Experience', category: 'stats', icon_name: 'Award', color_class: 'text-brand-orange', display_order: 1, locale: 'en' },
  { metric_key: 'clients_served', metric_value: '500+', metric_label: 'Clients Served', category: 'stats', icon_name: 'Users', color_class: 'text-brand-blue', display_order: 2, locale: 'en' },
  { metric_key: 'languages_supported', metric_value: '100+', metric_label: 'Languages Supported', category: 'stats', icon_name: 'Globe', color_class: 'text-brand-orange', display_order: 3, locale: 'en' },

  { metric_key: 'years_experience', metric_value: '+15', metric_label: 'عاماً من الخبرة', category: 'stats', icon_name: 'Award', color_class: 'text-brand-orange', display_order: 1, locale: 'ar' },
  { metric_key: 'clients_served', metric_value: '+500', metric_label: 'عميل', category: 'stats', icon_name: 'Users', color_class: 'text-brand-blue', display_order: 2, locale: 'ar' },
  { metric_key: 'languages_supported', metric_value: '+100', metric_label: 'لغة مغطاة حول العالم', category: 'stats', icon_name: 'Globe', color_class: 'text-brand-orange', display_order: 3, locale: 'ar' },

  // Achievements (real accreditations)
  { metric_key: 'iso_certification', metric_value: 'ISO 9001:2015', metric_label: 'Certified Quality Management System', category: 'achievements', icon_name: 'Award', color_class: 'text-green-600', display_order: 1, locale: 'en' },
  { metric_key: 'moj_accreditation', metric_value: 'UAE Ministry of Justice (MOJ)', metric_label: 'Officially Accredited Translation Office', category: 'achievements', icon_name: 'CheckCircle', color_class: 'text-blue-600', display_order: 2, locale: 'en' },
  { metric_key: 'courts_accreditation', metric_value: 'Dubai Courts & DIFC Courts', metric_label: 'Approved for Court Document Submissions', category: 'achievements', icon_name: 'Shield', color_class: 'text-purple-600', display_order: 3, locale: 'en' },
  { metric_key: 'diac_registration', metric_value: 'DIAC', metric_label: 'Registered with the Dubai International Arbitration Centre', category: 'achievements', icon_name: 'Award', color_class: 'text-orange-600', display_order: 4, locale: 'en' },
  { metric_key: 'regulatory_acceptance', metric_value: 'FTA · GCAA · DEWA · MOHAP · DHA · ICP · GDRFA', metric_label: 'Accepted by Key UAE Regulatory Authorities', category: 'achievements', icon_name: 'CheckCircle', color_class: 'text-blue-600', display_order: 5, locale: 'en' },

  { metric_key: 'iso_certification', metric_value: 'ISO 9001:2015', metric_label: 'نظام إدارة جودة معتمد عالمياً', category: 'achievements', icon_name: 'Award', color_class: 'text-green-600', display_order: 1, locale: 'ar' },
  { metric_key: 'moj_accreditation', metric_value: 'وزارة العدل (MOJ)', metric_label: 'مكتب ترجمة معتمد رسمياً', category: 'achievements', icon_name: 'CheckCircle', color_class: 'text-blue-600', display_order: 2, locale: 'ar' },
  { metric_key: 'courts_accreditation', metric_value: 'محاكم دبي و DIFC', metric_label: 'معتمدة لتقديم المستندات للمحاكم', category: 'achievements', icon_name: 'Shield', color_class: 'text-purple-600', display_order: 3, locale: 'ar' },
  { metric_key: 'diac_registration', metric_value: 'DIAC', metric_label: 'مسجلة لدى مركز دبي للتحكيم الدولي', category: 'achievements', icon_name: 'Award', color_class: 'text-orange-600', display_order: 4, locale: 'ar' },
  { metric_key: 'regulatory_acceptance', metric_value: 'FTA · GCAA · DEWA · MOHAP · DHA · ICP · GDRFA', metric_label: 'معتمدة لدى كبرى الجهات التنظيمية في الإمارات', category: 'achievements', icon_name: 'CheckCircle', color_class: 'text-blue-600', display_order: 5, locale: 'ar' },

  // Benefits / differentiators
  { metric_key: 'dual_discipline', metric_value: 'Dual-Discipline Mastery', metric_label: 'Licensed Translators Alongside Subject-Matter Experts', category: 'benefits', icon_name: 'CheckCircle', color_class: 'text-green-600', display_order: 1, locale: 'en' },
  { metric_key: 'three_tier_qa', metric_value: 'Three-Tier QA Process', metric_label: 'SME Drafting, Technical Verification, Final ISO Compliance Check', category: 'benefits', icon_name: 'Shield', color_class: 'text-blue-600', display_order: 2, locale: 'en' },
  { metric_key: 'dtp_lock', metric_value: 'DTP & Metric Lock', metric_label: '100% Structural and Numerical Accuracy in Layout', category: 'benefits', icon_name: 'CheckCircle', color_class: 'text-orange-600', display_order: 3, locale: 'en' },
  { metric_key: 'confidentiality', metric_value: 'NDA Protected', metric_label: 'Secure File Transfer and Enforceable Confidentiality', category: 'benefits', icon_name: 'Shield', color_class: 'text-green-600', display_order: 4, locale: 'en' },

  { metric_key: 'dual_discipline', metric_value: 'الخبرة المزدوجة', metric_label: 'مترجمون معتمدون إلى جانب خبراء متخصصين', category: 'benefits', icon_name: 'CheckCircle', color_class: 'text-green-600', display_order: 1, locale: 'ar' },
  { metric_key: 'three_tier_qa', metric_value: 'منظومة تدقيق ثلاثية', metric_label: 'ترجمة تخصصية، مراجعة فنية وقانونية، تدقيق نهائي', category: 'benefits', icon_name: 'Shield', color_class: 'text-blue-600', display_order: 2, locale: 'ar' },
  { metric_key: 'dtp_lock', metric_value: 'قفل البيانات والتنسيق', metric_label: 'مطابقة هيكلية ورقمية بنسبة 100%', category: 'benefits', icon_name: 'CheckCircle', color_class: 'text-orange-600', display_order: 3, locale: 'ar' },
  { metric_key: 'confidentiality', metric_value: 'سرية تامة', metric_label: 'اتفاقيات عدم إفشاء وتشفير نقل الملفات', category: 'benefits', icon_name: 'Shield', color_class: 'text-green-600', display_order: 4, locale: 'ar' },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let inserted = 0;
    let updated = 0;
    for (const m of METRICS) {
      const res = await client.query(
        `INSERT INTO company_metrics (metric_key, metric_value, metric_label, metric_description, category, icon_name, color_class, display_order, locale, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
         ON CONFLICT (metric_key, locale) DO UPDATE SET
           metric_value = EXCLUDED.metric_value,
           metric_label = EXCLUDED.metric_label,
           category = EXCLUDED.category,
           icon_name = EXCLUDED.icon_name,
           color_class = EXCLUDED.color_class,
           display_order = EXCLUDED.display_order,
           updated_at = CURRENT_TIMESTAMP
         RETURNING (xmax = 0) AS inserted`,
        [m.metric_key, m.metric_value, m.metric_label, m.metric_description || null, m.category, m.icon_name, m.color_class, m.display_order, m.locale]
      );
      if (res.rows[0].inserted) inserted++; else updated++;
    }
    await client.query('COMMIT');
    console.log(`✅ company_metrics seeded: ${inserted} inserted, ${updated} updated (${METRICS.length} total).`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to seed company_metrics:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
