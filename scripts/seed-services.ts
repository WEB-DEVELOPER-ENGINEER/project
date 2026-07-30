#!/usr/bin/env npx tsx
/**
 * Seeds service_categories and services with a real, working service
 * catalog for JUSOR, approved by the site owner on 2026-07-30 as a
 * starting draft (refinable later via the admin panel).
 *
 * Content policy for this seed: descriptive copy about what each service
 * covers is fine (that's how certified translation offerings are generally
 * described industry-wide), but this script deliberately does NOT invent
 * unverifiable specifics — no fake certifications, no invented stats
 * ("500+ projects"), no guaranteed turnaround promises, no fabricated
 * testimonials. Those stay empty until the site owner provides real values.
 *
 * Usage: npx tsx scripts/seed-services.ts
 */

import { pool } from '../lib/database';

const CATEGORIES = [
  { name: 'Translation Services', slug: 'translation', description: 'Certified and general document translation.', color: 'blue', icon_name: 'FileText' },
  { name: 'Legal Services', slug: 'legal', description: 'Legal, court, and litigation translation.', color: 'indigo', icon_name: 'Scale' },
  { name: 'Technical Services', slug: 'technical', description: 'Technical and engineering document translation.', color: 'orange', icon_name: 'Cog' },
  { name: 'Business Solutions', slug: 'business', description: 'Corporate, financial, and business translation.', color: 'green', icon_name: 'Briefcase' },
  { name: 'Digital Services', slug: 'digital', description: 'Localization and desktop publishing.', color: 'purple', icon_name: 'Globe' },
];

interface ServiceSeed {
  title: string;
  slug: string;
  categorySlug: string;
  short_description: string;
  overview: string;
  key_benefits: string[];
  faq_items: Array<{ question: string; answer: string }>;
  meta_description: string;
}

const PROCESS_STEPS = [
  { step: 1, title: 'Submit Your Document', description: 'Send us your document via our contact form, email, or WhatsApp — we accept PDF, Word, and scanned image formats.' },
  { step: 2, title: 'Quote & Confirmation', description: 'We review the document and language pair and confirm scope and delivery timeline with you before starting.' },
  { step: 3, title: 'Translation & Review', description: 'A qualified translator prepares the translation, which is then checked for accuracy and consistency.' },
  { step: 4, title: 'Delivery', description: 'You receive the completed translation, with certification/stamping included where the service requires it.' },
];

const SERVICES: ServiceSeed[] = [
  {
    title: 'Certified Document Translation',
    slug: 'certified-document-translation',
    categorySlug: 'translation',
    short_description: 'Certified translation of personal and official documents between Arabic and English, accepted by UAE government entities.',
    overview: '<p>Certified translation is required whenever a document in one language needs to be submitted to a government entity, court, bank, or institution operating in another language. Our certified translations carry an official translator stamp and signature confirming the translation is a true and accurate rendering of the original document.</p><p>We handle personal documents such as birth, marriage, and death certificates, academic transcripts and diplomas, Emirates ID and passport translations, driving licenses, and police clearance certificates, among others.</p>',
    key_benefits: ['Certified and stamped translations', 'Arabic and English language pairs', 'Personal and official document types', 'Digital and hard-copy delivery options'],
    faq_items: [
      { question: 'What documents can be certified translated?', answer: 'Common examples include birth/marriage/death certificates, academic transcripts and diplomas, passports, Emirates ID, driving licenses, and police clearance certificates. If you have a document type not listed here, contact us to confirm we can assist.' },
      { question: 'Is a certified translation the same as a notarized translation?', answer: 'No. A certified translation includes a signed statement and stamp from the translator/translation office confirming accuracy. Notarization is a separate, additional step performed by a notary public and is only required for specific use cases — we can advise which applies to your situation.' },
      { question: 'Which government entities accept your certified translations?', answer: 'Certified translations from a licensed UAE translation office are generally accepted by UAE government departments, courts, and educational/immigration authorities. Requirements can vary by entity, so we recommend confirming the specific requirement for your submission in advance.' },
    ],
    meta_description: 'Certified document translation between Arabic and English for personal and official documents, accepted by UAE government entities.',
  },
  {
    title: 'Legal Translation',
    slug: 'legal-translation',
    categorySlug: 'legal',
    short_description: 'Precise translation of contracts, agreements, and legal correspondence for law firms, businesses, and individuals.',
    overview: '<p>Legal translation requires close attention to precise terminology, since even small mismatches in legal language can change the meaning or enforceability of a document. We translate contracts, memoranda of association, powers of attorney, legal correspondence, and other legal instruments between Arabic and English.</p><p>Our translators work carefully to preserve the structure and legal terminology of the source document so the translated version reflects its intended legal effect.</p>',
    key_benefits: ['Accurate legal terminology', 'Confidential handling of sensitive documents', 'Contracts, POAs, and corporate legal documents', 'Arabic and English language pairs'],
    faq_items: [
      { question: 'What types of legal documents do you translate?', answer: 'Contracts and agreements, memoranda and articles of association, powers of attorney, legal correspondence, and other legal instruments in Arabic and English.' },
      { question: 'How do you handle confidential legal documents?', answer: 'We treat all client documents as confidential and limit access to the assigned translator and reviewer for your project.' },
      { question: 'Can legal translations be certified for court submission?', answer: 'Yes — where a legal translation needs to be certified for submission to a court or government entity, we provide the translation with the required certification.' },
    ],
    meta_description: 'Legal translation of contracts, agreements, powers of attorney, and legal correspondence between Arabic and English.',
  },
  {
    title: 'Court & Litigation Translation',
    slug: 'court-litigation-translation',
    categorySlug: 'legal',
    short_description: 'Translation of court documents, statements of claim, judgments, and litigation records for legal proceedings in Dubai and the UAE.',
    overview: '<p>Court and litigation translation covers the documents used throughout a legal case — statements of claim, defense briefs, court judgments, witness statements, and evidentiary documents. Accuracy is critical, since these translations may be relied on directly by judges, lawyers, and litigants.</p><p>We work with law firms and individuals to translate case documents between Arabic and English for submission to UAE courts and arbitration centres.</p>',
    key_benefits: ['Statements of claim and defense briefs', 'Court judgments and rulings', 'Arbitration documents', 'Confidential case handling'],
    faq_items: [
      { question: 'Do you translate documents for arbitration centres such as DIAC?', answer: 'Yes, we translate arbitration briefs, awards, and related documents for submission to arbitration centres.' },
      { question: 'Can you translate a judgment issued by a foreign court?', answer: 'Yes, we translate foreign court judgments into Arabic or English as required for recognition or enforcement proceedings in the UAE.' },
      { question: 'How quickly can urgent court-deadline translations be handled?', answer: 'Contact us with your deadline and document details and we will confirm whether we can accommodate an expedited timeline for your specific case.' },
    ],
    meta_description: 'Certified translation of court documents, statements of claim, judgments, and litigation records for UAE legal proceedings.',
  },
  {
    title: 'Immigration & Visa Translation',
    slug: 'immigration-visa-translation',
    categorySlug: 'translation',
    short_description: 'Certified translation of documents required for UAE visa applications, residency, and immigration procedures.',
    overview: '<p>Visa and immigration applications in the UAE often require certified Arabic translations of supporting documents — including employment contracts, medical reports, bank statements, and proof-of-address documents. We prepare these translations to the standard required for submission with visa and Golden Visa applications.</p>',
    key_benefits: ['Golden Visa and residency document translation', 'Employment contracts and medical reports', 'Bank statements and proof of address', 'Certified for government submission'],
    faq_items: [
      { question: 'Which documents are commonly required for Golden Visa applications?', answer: 'Common documents include employment contracts, salary certificates, bank statements, and medical reports — the exact list depends on the visa category, so we recommend confirming requirements with the relevant authority.' },
      { question: 'Can WhatsApp chat records be translated as supporting evidence?', answer: 'Yes, we can translate chat records and similar informal communications where they are being submitted as supporting evidence for an immigration matter.' },
      { question: 'Do you translate tourist visa documents?', answer: 'Yes, we translate the documents commonly required for UAE tourist visa applications.' },
    ],
    meta_description: 'Certified translation of documents for UAE visa, residency, and Golden Visa applications, including employment contracts and medical reports.',
  },
  {
    title: 'Academic Certificate Translation',
    slug: 'academic-certificate-translation',
    categorySlug: 'translation',
    short_description: 'Certified translation of diplomas, transcripts, and academic certificates for university admissions and credential recognition.',
    overview: '<p>We translate academic documents — degrees, diplomas, transcripts, and school certificates — for students and professionals applying to universities, seeking credential recognition, or submitting documents to educational authorities in the UAE.</p>',
    key_benefits: ['Diplomas and degree certificates', 'Academic transcripts', 'School and course certificates', 'Certified for university/authority submission'],
    faq_items: [
      { question: 'Do universities accept your certified academic translations?', answer: 'Certified translations from a licensed translation office are generally accepted by universities and educational authorities; we recommend confirming the specific requirement of the receiving institution.' },
      { question: 'Can you translate transcripts with grading tables?', answer: 'Yes, we translate transcripts including grading tables and course listings, preserving the original structure.' },
    ],
    meta_description: 'Certified translation of diplomas, transcripts, and academic certificates for university admissions and credential recognition.',
  },
  {
    title: 'Medical Translation',
    slug: 'medical-translation',
    categorySlug: 'translation',
    short_description: 'Accurate translation of medical reports, prescriptions, and health records for patients, insurers, and healthcare providers.',
    overview: '<p>Medical translation requires careful handling of clinical terminology. We translate medical reports, discharge summaries, prescriptions, lab results, and insurance documents between Arabic and English for patients, healthcare providers, and insurers.</p>',
    key_benefits: ['Medical reports and discharge summaries', 'Prescriptions and lab results', 'Insurance and claims documents', 'Confidential handling of patient data'],
    faq_items: [
      { question: 'Do you translate medical reports for visa or immigration purposes?', answer: 'Yes, medical report translation is commonly required alongside other documents for visa and immigration applications.' },
      { question: 'How is patient confidentiality protected?', answer: 'Medical documents are handled with the same confidentiality as our other document types, with access limited to the assigned translator and reviewer.' },
    ],
    meta_description: 'Certified translation of medical reports, prescriptions, and health records between Arabic and English.',
  },
  {
    title: 'Financial & Business Translation',
    slug: 'financial-business-translation',
    categorySlug: 'business',
    short_description: 'Translation of financial statements, bank documents, and business correspondence for companies and financial institutions.',
    overview: '<p>We translate financial statements, bank statements, audit reports, tax documents, and general business correspondence, helping companies and individuals communicate accurately across languages for banking, compliance, and reporting purposes.</p>',
    key_benefits: ['Bank statements and financial reports', 'Tax and compliance documents', 'Business correspondence', 'Arabic and English language pairs'],
    faq_items: [
      { question: 'Do banks in Dubai require certified translations of foreign bank statements?', answer: 'Many banks require certified translations of foreign-language bank statements for compliance and verification purposes — we can prepare these to the required standard.' },
      { question: 'Can you translate audited financial statements?', answer: 'Yes, we translate audited financial statements and related corporate financial documents.' },
    ],
    meta_description: 'Translation of financial statements, bank documents, tax records, and business correspondence between Arabic and English.',
  },
  {
    title: 'Technical & Engineering Translation',
    slug: 'technical-engineering-translation',
    categorySlug: 'technical',
    short_description: 'Translation of technical manuals, specifications, and engineering documents requiring precise industry terminology.',
    overview: '<p>Technical translation covers manuals, product specifications, safety data sheets, and engineering documentation where precise, consistent terminology matters. We work across technical domains to produce translations that preserve the original meaning and formatting of specifications and manuals.</p>',
    key_benefits: ['Technical manuals and specifications', 'Engineering and industrial documents', 'Consistent terminology across documents', 'Arabic and English language pairs'],
    faq_items: [
      { question: 'Can you maintain formatting for technical manuals with diagrams and tables?', answer: 'Yes, we work to preserve the original layout, tables, and structure of technical documents as closely as possible.' },
      { question: 'Do you translate for the aviation and energy sectors?', answer: 'Yes, we translate technical and regulatory documents for sectors including aviation, oil & gas, and renewable energy.' },
    ],
    meta_description: 'Technical translation of manuals, specifications, and engineering documents between Arabic and English.',
  },
  {
    title: 'Contracts & Corporate Document Translation',
    slug: 'contracts-corporate-document-translation',
    categorySlug: 'business',
    short_description: 'Translation of commercial contracts, corporate governance documents, and franchise agreements for businesses operating in the UAE.',
    overview: '<p>We translate the corporate documents businesses need for registration, compliance, and day-to-day operations in the UAE — commercial contracts, franchise and agency agreements, memoranda of association, and corporate governance documents.</p>',
    key_benefits: ['Commercial contracts and agreements', 'Franchise and agency documents', 'Corporate governance documentation', 'Certified for government submission where required'],
    faq_items: [
      { question: 'Do you translate franchise and distribution agreements?', answer: 'Yes, we translate franchise agreements, exclusive agency contracts, and distribution agreements between Arabic and English.' },
      { question: 'Can you translate documents for company registration with UAE authorities?', answer: 'Yes, we translate the corporate documents commonly required for business registration and licensing procedures.' },
    ],
    meta_description: 'Translation of commercial contracts, franchise agreements, and corporate governance documents for UAE businesses.',
  },
  {
    title: 'Website & Software Localization',
    slug: 'website-software-localization',
    categorySlug: 'digital',
    short_description: 'Localization of websites, apps, and software interfaces into Arabic, adapted for UAE and regional audiences.',
    overview: '<p>Localization goes beyond translation — adapting website copy, app interfaces, and software strings so they read naturally and function correctly for Arabic-speaking users, including right-to-left (RTL) layout considerations.</p>',
    key_benefits: ['Website and app content localization', 'RTL-aware Arabic adaptation', 'UI/UX string translation', 'Consistent brand terminology'],
    faq_items: [
      { question: 'Do you handle right-to-left (RTL) layout considerations?', answer: 'We translate and adapt content with RTL presentation in mind; layout implementation itself is typically handled by your development team using our translated content.' },
      { question: 'Can you localize mobile app store listings?', answer: 'Yes, we translate app store descriptions, screenshots text, and related marketing copy for Arabic-speaking markets.' },
    ],
    meta_description: 'Website, app, and software localization into Arabic with RTL-aware adaptation for UAE and regional audiences.',
  },
  {
    title: 'Desktop Publishing (DTP)',
    slug: 'desktop-publishing-dtp',
    categorySlug: 'digital',
    short_description: 'Formatting and layout of translated documents to match the original design, including brochures, reports, and multilingual materials.',
    overview: '<p>When a translated document needs to keep its original design — brochures, reports, presentations, or multilingual materials — our desktop publishing service reformats the translated text to match the source layout, including for right-to-left Arabic typesetting.</p>',
    key_benefits: ['Layout matching for brochures and reports', 'Arabic RTL typesetting', 'Multilingual document formatting', 'Print-ready and digital output'],
    faq_items: [
      { question: 'What file formats do you support for DTP?', answer: 'We commonly work with formats such as InDesign, Word, and PowerPoint source files — contact us to confirm compatibility with your specific file.' },
      { question: 'Can you typeset Arabic text alongside English in the same document?', answer: 'Yes, we handle bilingual layouts combining Arabic (RTL) and English (LTR) content in the same document.' },
    ],
    meta_description: 'Desktop publishing and layout formatting for translated documents, including Arabic RTL typesetting.',
  },
  {
    title: 'Consecutive Interpretation',
    slug: 'consecutive-interpretation',
    categorySlug: 'translation',
    short_description: 'On-site interpretation for meetings, negotiations, and appointments where the interpreter relays speech after each speaker pauses.',
    overview: '<p>Consecutive interpretation is used for meetings, business negotiations, legal appointments, and medical consultations, where the interpreter listens to a segment of speech and then relays it in the other language. This format works well for smaller, interactive settings.</p>',
    key_benefits: ['On-site meeting and negotiation support', 'Legal and medical appointment interpretation', 'Arabic-English interpretation', 'Suited to smaller interactive settings'],
    faq_items: [
      { question: 'When is consecutive interpretation the right choice over simultaneous?', answer: 'Consecutive interpretation suits smaller meetings, negotiations, and appointments where pauses for interpretation are practical; simultaneous interpretation is better suited to conferences and larger events.' },
      { question: 'Can you provide interpreters for legal appointments such as notary visits?', answer: 'Yes, we provide interpretation support for legal appointments including notary and court-related meetings.' },
    ],
    meta_description: 'On-site consecutive interpretation for meetings, negotiations, and legal or medical appointments in Arabic and English.',
  },
  {
    title: 'Simultaneous Interpretation',
    slug: 'simultaneous-interpretation',
    categorySlug: 'translation',
    short_description: 'Real-time interpretation for conferences, seminars, and large events, delivered as the speaker talks.',
    overview: '<p>Simultaneous interpretation is delivered in real time as the speaker talks, typically using interpretation equipment, and is suited to conferences, seminars, and large multilingual events where continuous communication is required.</p>',
    key_benefits: ['Real-time conference interpretation', 'Suited to large multilingual events', 'Arabic-English interpretation', 'Coordination with event organizers'],
    faq_items: [
      { question: 'Do you provide the interpretation equipment for events?', answer: 'Equipment arrangements vary by event — contact us with your event details so we can confirm what is needed and how it will be arranged.' },
      { question: 'How far in advance should simultaneous interpretation be booked?', answer: 'We recommend contacting us as early as possible for conference and event interpretation so we can confirm availability for your event date.' },
    ],
    meta_description: 'Real-time simultaneous interpretation for conferences, seminars, and multilingual events in Arabic and English.',
  },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const categoryIds = new Map<string, number>();
    for (const cat of CATEGORIES) {
      const res = await client.query(
        `INSERT INTO service_categories (name, slug, description, icon_name, color, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5, true, 0)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [cat.name, cat.slug, cat.description, cat.icon_name, cat.color]
      );
      categoryIds.set(cat.slug, res.rows[0].id);
    }
    console.log(`✅ ${CATEGORIES.length} service categories ready.`);

    let inserted = 0;
    let updated = 0;
    for (let i = 0; i < SERVICES.length; i++) {
      const s = SERVICES[i];
      const categoryId = categoryIds.get(s.categorySlug) ?? null;
      const content = `${s.overview}`;
      const res = await client.query(
        `INSERT INTO services (
           title, content, slug, sort_order, is_active,
           short_description, overview, key_benefits, process_steps, faq_items,
           category_id, service_category, languages_supported,
           meta_title, meta_description, meta_keywords,
           cta_primary_text, cta_primary_url
         ) VALUES (
           $1, $2, $3, $4, true,
           $5, $6, $7, $8, $9,
           $10, $11, $12,
           $13, $14, $15,
           $16, $17
         )
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           content = EXCLUDED.content,
           short_description = EXCLUDED.short_description,
           overview = EXCLUDED.overview,
           key_benefits = EXCLUDED.key_benefits,
           process_steps = EXCLUDED.process_steps,
           faq_items = EXCLUDED.faq_items,
           category_id = EXCLUDED.category_id,
           service_category = EXCLUDED.service_category,
           languages_supported = EXCLUDED.languages_supported,
           meta_title = EXCLUDED.meta_title,
           meta_description = EXCLUDED.meta_description,
           meta_keywords = EXCLUDED.meta_keywords,
           updated_at = CURRENT_TIMESTAMP
         RETURNING (xmax = 0) AS inserted`,
        [
          s.title,
          content,
          s.slug,
          i,
          s.short_description,
          s.overview,
          s.key_benefits,
          JSON.stringify(PROCESS_STEPS),
          JSON.stringify(s.faq_items),
          categoryId,
          s.categorySlug,
          ['Arabic', 'English'],
          `${s.title} | JUSOR Translation Services`,
          s.meta_description,
          s.key_benefits.slice(0, 5),
          'Get a Free Quote',
          '/contact',
        ]
      );
      if (res.rows[0].inserted) inserted++; else updated++;
    }

    await client.query('COMMIT');
    console.log(`✅ services seeded: ${inserted} inserted, ${updated} updated (${SERVICES.length} total).`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to seed services:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
