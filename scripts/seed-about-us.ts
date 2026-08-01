#!/usr/bin/env npx tsx
/**
 * Seeds the about_us table with JUSOR's real company story, mission,
 * vision, differentiators, and accreditations — provided directly by the
 * site owner from the company's own corporate profile (2026), in both
 * English and Arabic. One row per locale, linked by translation_group.
 *
 * Content policy: everything here is either directly quoted/paraphrased
 * from the owner-provided profile, or a faithful translation of it. No
 * numbers, certifications, or claims are invented beyond what was given.
 *
 * Usage: npx tsx scripts/seed-about-us.ts
 */

import { pool } from '../lib/database';

const TRANSLATION_GROUP = 'main';

const VALUES_EN = [
  {
    title: 'Dual-Discipline Mastery',
    description: 'Projects are handled by licensed, certified translators working alongside domain subject-matter experts — corporate lawyers, engineers, and financial analysts — not generalist linguists.',
    icon: 'Users',
  },
  {
    title: 'Three-Tier ISO Quality Process',
    description: 'Every document goes through SME drafting, independent technical and legal verification, and a final ISO compliance and formatting audit.',
    icon: 'CheckCircle',
  },
  {
    title: 'DTP & Structural Preservation',
    description: 'Numbers, budgets, mathematical formulas, and engineering symbols are digitally locked during layout to maintain 100% structural and numerical accuracy.',
    icon: 'FileText',
  },
  {
    title: 'Ironclad Confidentiality',
    description: 'Strict non-disclosure agreements and encrypted file transfer protocols protect sensitive corporate and government information.',
    icon: 'Shield',
  },
];

const VALUES_AR = [
  {
    title: 'الخبرة المزدوجة',
    description: 'لا نعتمد على لغويين عموميين؛ تُنفَّذ مشاريعنا بواسطة مترجمين قانونيين معتمدين ومحلفين إلى جانب خبراء متخصصين — محامون تجاريون، مهندسون، ومحللون ماليون.',
    icon: 'Users',
  },
  {
    title: 'المنظومة الثلاثية للتدقيق',
    description: 'تمر كل وثيقة بمرحلة الترجمة التخصصية، ثم المراجعة الفنية والقانونية للمصطلحات، ثم التدقيق النهائي والتنسيق المطابق لمعايير الآيزو.',
    icon: 'CheckCircle',
  },
  {
    title: 'الحفاظ على التنسيق والبيانات الفنية',
    description: 'نقفل الأرقام والميزانيات والمعادلات الرياضية والرموز الهندسية أثناء التنسيق لضمان المطابقة الهيكلية والحسابية بنسبة 100%.',
    icon: 'FileText',
  },
  {
    title: 'الأمان السري للبيانات',
    description: 'اتفاقيات عدم إفشاء صارمة وبروتوكولات تشفير لنقل الملفات لحماية المعلومات المؤسسية والحكومية الحساسة.',
    icon: 'Shield',
  },
];

const CERTIFICATIONS_EN = [
  { name: 'ISO 9001:2015', issuer: 'International Organization for Standardization', description: 'Certified Quality Management System' },
  { name: 'UAE Ministry of Justice (MOJ)', issuer: 'Government of the United Arab Emirates', description: 'Officially accredited translation office' },
  { name: 'Dubai Courts & DIFC Courts', issuer: 'Dubai Judicial Department / DIFC', description: 'Approved for court document submissions' },
  { name: 'DIAC', issuer: 'Dubai International Arbitration Centre', description: 'Registered for arbitration case translation' },
  { name: 'FTA, GCAA, DEWA, MOHAP, DHA, ICP & GDRFA', issuer: 'UAE Federal & Local Regulatory Authorities', description: 'Accepted across key UAE regulatory bodies' },
];

const CERTIFICATIONS_AR = [
  { name: 'ISO 9001:2015', issuer: 'المنظمة الدولية للمعايير', description: 'نظام إدارة جودة معتمد عالمياً' },
  { name: 'وزارة العدل (MOJ)', issuer: 'حكومة دولة الإمارات العربية المتحدة', description: 'مكتب ترجمة معتمد رسمياً' },
  { name: 'محاكم دبي ومحاكم DIFC', issuer: 'دائرة القضاء بدبي / مركز دبي المالي العالمي', description: 'معتمدة لتقديم المستندات للمحاكم' },
  { name: 'مركز دبي للتحكيم الدولي (DIAC)', issuer: 'مركز دبي للتحكيم الدولي', description: 'مسجلة لترجمة قضايا التحكيم' },
  { name: 'FTA, GCAA, DEWA, MOHAP, DHA, ICP, GDRFA', issuer: 'الجهات الاتحادية والمحلية في دولة الإمارات', description: 'معتمدة لدى كبرى الجهات التنظيمية في الإمارات' },
];

const ROWS = [
  {
    locale: 'en',
    title: 'About Jusor Al Kalimate',
    slogan: 'Bridges of Words',
    description: 'Founded by legal translators and business strategists, Jusor Al Kalimate ("Bridges of Words") serves as a dedicated language partner for legal entities, multinational corporations, and individuals — bringing over 15 years of institutional expertise and 500+ clients served across the UAE and internationally.',
    mission: 'To eliminate corporate risk and safeguard client interests through dual-discipline precision, bridging language barriers with officially accredited legal, technical, and financial translations.',
    vision: 'To remain the premier language partner and regional authority for certified translation, renowned for technical accuracy, ISO-managed quality, and absolute legal validity.',
    story: 'Jusor Al Kalimate was established to serve as a dedicated language partner for legal entities, multinational corporations, and individuals — bringing together certified legal translators and business strategists under one certified quality system.',
    story_continuation: 'Operating under a certified ISO 9001:2015 quality management system and officially accredited by the UAE Ministry of Justice, we ensure full compliance across UAE onshore and offshore jurisdictions, serving clients such as EMAAR, Al Futtaim Group, Aster DM Healthcare, Carrefour, Invest Bank, the Sharjah Documentation & Archiving Authority, Rafid, Khorfakkan Club, and AAAID.',
    values: VALUES_EN,
    certifications: CERTIFICATIONS_EN,
    meta_title: 'About Jusor Al Kalimate | Certified Translation Services in Dubai, UAE',
    meta_description: 'Jusor Al Kalimate — ISO 9001:2015 certified, MOJ-accredited certified translation and localization office in Dubai, UAE, with 15+ years of experience and 500+ clients served.',
  },
  {
    locale: 'ar',
    title: 'عن جسور الكلمات للترجمة والتعريب المعتمدة',
    // The English row's slogan is the translation of the Arabic name; the
    // Arabic row should carry the name itself, not its English rendering.
    slogan: 'جسور الكلمات',
    description: 'تأسست جسور الكلمات للترجمة والتعريب المعتمدة لتكون الشريك اللغوي والاستراتيجي الأبرز للشركات والمؤسسات والأفراد، بخبرة ممتدة لأكثر من 15 عاماً وأكثر من 500 عميل محلي ودولي.',
    mission: 'حماية المصالح القانونية والمالية والتجارية لعملائنا من خلال إلغاء هامش الخطأ اللغوي، وتقديم ترجمات معتمدة متخصصة تعكس الدقة الفنية وتفي بالاشتراطات التنظيمية المعقدة.',
    vision: 'أن نكون الدرع اللغوي والمعيار المرجعي الأول للترجمة المعتمدة والتوطين في المنطقة، عبر الدمج بين الخبرة القانونية والهندسية والالتزام المطلق بمعايير الجودة العالمية.',
    story: 'تأسست جسور الكلمات للترجمة والتعريب المعتمدة لتكون الشريك اللغوي والاستراتيجي الأبرز للشركات والمؤسسات والأفراد، جامعةً مترجمين قانونيين معتمدين واستراتيجيي أعمال تحت نظام جودة واحد معتمد.',
    story_continuation: 'نعمل وفق نظام إدارة جودة صارم ومعتمد عالمياً بشهادة ISO 9001:2015، وترجمتنا معتمدة رسمياً من وزارة العدل في دولة الإمارات العربية المتحدة وكافة الجهات والهيئات الحكومية، ونفخر بكوننا الشريك اللغوي المعتمد لمؤسسات مثل إعمار، مجموعة الفطيم، آستر دي إم للرعاية الصحية، كارفور، إنفست بنك، هيئة الشارقة للوثائق والأرشيف، رفد، نادي خورفكان الرياضي، وAAAID.',
    values: VALUES_AR,
    certifications: CERTIFICATIONS_AR,
    meta_title: 'عن جسور الكلمات | خدمات ترجمة معتمدة في دبي، الإمارات',
    meta_description: 'جسور الكلمات — مكتب ترجمة معتمد بشهادة ISO 9001:2015 ومعتمد من وزارة العدل في دبي، الإمارات، بخبرة تفوق 15 عاماً وأكثر من 500 عميل.',
  },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let inserted = 0;
    let updated = 0;

    for (const row of ROWS) {
      // One row per locale: update the existing active row for this locale
      // if present, otherwise insert a new one.
      const existing = await client.query(
        `SELECT id FROM about_us WHERE locale = $1 AND is_active = true ORDER BY created_at ASC LIMIT 1`,
        [row.locale]
      );

      if (existing.rows.length > 0) {
        await client.query(
          `UPDATE about_us SET
             title = $1, slogan = $2, description = $3, mission = $4, vision = $5,
             story = $6, story_continuation = $7, values = $8, certifications = $9,
             meta_title = $10, meta_description = $11, translation_group = $12,
             updated_at = CURRENT_TIMESTAMP
           WHERE id = $13`,
          [
            row.title, row.slogan, row.description, row.mission, row.vision,
            row.story, row.story_continuation, JSON.stringify(row.values), JSON.stringify(row.certifications),
            row.meta_title, row.meta_description, TRANSLATION_GROUP,
            existing.rows[0].id,
          ]
        );
        updated++;
      } else {
        await client.query(
          `INSERT INTO about_us (
             title, slogan, description, mission, vision, story, story_continuation,
             values, certifications, meta_title, meta_description, locale, translation_group, is_active
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true)`,
          [
            row.title, row.slogan, row.description, row.mission, row.vision,
            row.story, row.story_continuation, JSON.stringify(row.values), JSON.stringify(row.certifications),
            row.meta_title, row.meta_description, row.locale, TRANSLATION_GROUP,
          ]
        );
        inserted++;
      }
    }

    await client.query('COMMIT');
    console.log(`✅ about_us seeded: ${inserted} inserted, ${updated} updated.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to seed about_us:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
