#!/usr/bin/env npx tsx
/**
 * One-off replacement for blog_posts id=8, whose source .docx was corrupted
 * (interleaved/scrambled sentences — see conversation history). Per the site
 * owner's instruction: remove the corrupted article and rewrite it from
 * scratch covering the same topic/keywords (real estate mortgage & banking
 * document translation in Dubai), with full SEO/GEO/AEO structure.
 *
 * This does NOT touch the other 30 articles or the seed-articles.ts docx
 * pipeline — it's a single, direct upsert for this one article.
 *
 * Usage: npx tsx scripts/rewrite-article-real-estate-mortgage.ts
 */

import { pool } from '../lib/database';
import { extractFaqItems } from '../lib/extract-faq';

const TITLE = 'Certified Legal Translation for Real Estate Mortgages and Banking Documents in Dubai';
const SLUG = 'certified-legal-translation-for-real-estate-mortgages-and-banking-documents-in-dubai';

const CONTENT = `
<p>Buying property or securing financing in Dubai almost always means submitting documents to a bank, the Dubai Land Department (DLD), or a mortgage registration authority — and when those documents originate abroad or mix languages, a certified Arabic translation is required before they can be accepted. This guide covers the real estate and banking documents most commonly requiring certified translation in Dubai, and what the certification process involves.</p>

<h2 id="why-real-estate-and-banking-translation-matters-in-dubai"><strong>Why Real Estate and Banking Document Translation Matters in Dubai</strong></h2>
<p>Dubai's property and mortgage market draws buyers, investors, and lenders from around the world, but the UAE's official language for legal and financial registration is Arabic. Banks assessing a mortgage application, and the Dubai Land Department processing a property transfer, both require certified Arabic translations of any foreign-language supporting documents. This is not a formality — mismatched or informal translations can delay financing approval or property registration, and in some cases can create ambiguity in exactly what a borrower or buyer has agreed to.</p>
<p>A certified translation carries a signed statement and stamp from a licensed translation office confirming the translated document accurately reflects the original. This gives banks, the DLD, and other authorities a document they can rely on for verification and compliance purposes.</p>

<h2 id="key-real-estate-and-banking-documents-requiring-certified-translation"><strong>Key Real Estate and Banking Documents Requiring Certified Translation</strong></h2>

<h3 id="1-mortgage-and-loan-agreements"><strong>1. Mortgage and Loan Agreements</strong></h3>
<p>Mortgage agreements set out the loan amount, repayment terms, interest structure, and the lender's rights in the event of default. When a mortgage is arranged with an international bank, or when a foreign loan agreement needs to be presented to a UAE lender or authority, a certified translation ensures every clause — repayment schedule, penalties, and collateral terms — is rendered precisely into Arabic or English.</p>

<h3 id="2-title-deeds-and-property-registration-documents"><strong>2. Title Deeds and Property Registration Documents</strong></h3>
<p>Title deeds, initial sale contracts, and other Dubai Land Department registration documents must be presented in Arabic for official filing. Where a property was previously registered or sold under a foreign-language contract, a certified translation of that contract is typically required to support the Dubai registration process.</p>

<h3 id="3-bank-statements"><strong>3. Bank Statements</strong></h3>
<p>Banks assessing a mortgage or financing application routinely request several months of bank statements to verify income and cash flow. When those statements are issued by a foreign bank in a language other than Arabic or English, a certified translation of bank statements is generally required so the lender's compliance and credit teams can review them accurately.</p>

<h3 id="4-utility-bills-and-proof-of-address"><strong>4. Utility Bills and Proof of Address</strong></h3>
<p>Utility bills — electricity, water, or home internet — along with tenancy contracts, are commonly used as proof of address in mortgage and banking applications. Where these are issued abroad in a foreign language, translating them into Arabic or English allows the receiving bank or authority to confirm the applicant's residential history.</p>

<h3 id="5-salary-certificates-and-income-proof"><strong>5. Salary Certificates and Income Proof</strong></h3>
<p>Salary certificates, employment contracts, and other income documentation are core to mortgage pre-approval. A certified translation of these documents allows a UAE bank to assess an applicant's income and employment status against its lending criteria, particularly when the applicant is employed outside the UAE.</p>

<h2 id="the-certified-translation-process-for-financial-and-property-documents"><strong>The Certified Translation Process for Financial and Property Documents</strong></h2>
<p>The process typically follows the same steps as other certified translation work: the document is reviewed for language pair and complexity, translated by a qualified translator familiar with financial and property terminology, checked for accuracy, and then issued with the required certification stamp and signature. Where a document is being submitted directly to the Dubai Land Department or a specific bank, it's worth confirming that institution's exact submission requirements in advance, since requirements can vary slightly between banks and government departments.</p>

<hr/>
<h2 id="frequently-asked-questions"><strong>Frequently Asked Questions</strong></h2>
<p><strong>1. Do banks in Dubai require certified translation of foreign mortgage or loan agreements?</strong></p>
<p>Yes. When a mortgage or loan agreement is drafted in a language other than Arabic, UAE banks generally require a certified Arabic translation to assess the terms accurately and to support their internal compliance review before approving financing.</p>
<p><strong>2. What documents are accepted as proof of address for a mortgage application?</strong></p>
<p>Commonly accepted proof-of-address documents include utility bills (electricity, water, or internet), tenancy contracts, and bank statements showing a residential address. When these are issued abroad in a foreign language, a certified translation is typically needed before a bank or the Dubai Land Department will accept them.</p>
<p><strong>3. Can salary certificates and income proof be translated for mortgage pre-approval?</strong></p>
<p>Yes. Salary certificates, employment contracts, and other income documents can be certified translated so a UAE bank can review an applicant's income and employment status as part of mortgage pre-approval, particularly for applicants employed outside the UAE.</p>
`.trim();

async function main() {
  const client = await pool.connect();
  try {
    const tags = ['Legal Translation', 'Certified Translation', 'Dubai', 'UAE', 'Real Estate', 'Banking', 'Mortgages', 'Contracts'];
    const description = "A guide to certified translation for Dubai real estate mortgages and banking documents — mortgage agreements, title deeds, bank statements, utility bills, and salary certificates.";
    const metaTitle = `${TITLE} | Jusor Certified Translation`;
    const metaDescription = `${description} Certified translation services in Dubai.`;

    const wordCount = CONTENT.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const faqItems = extractFaqItems(CONTENT);
    if (faqItems.length !== 3) {
      throw new Error(`Expected 3 FAQ items to parse correctly, got ${faqItems.length} — aborting before writing to the database.`);
    }

    const schemaMarkup = {
      '@type': 'Article',
      '@context': 'https://schema.org',
      headline: TITLE,
      description,
      inLanguage: 'en',
      author: { '@type': 'Organization', name: 'JUSOR Team' },
      publisher: {
        '@type': 'Organization',
        name: 'JUSOR Alkalimat Certified & Legal Translation',
        logo: { '@type': 'ImageObject', url: 'https://jusortrans.com/jusor.png' },
      },
      mainEntityOfPage: { '@id': `https://jusortrans.com/blog/${SLUG}` },
    };

    const tableOfContents = [
      { id: 'why-real-estate-and-banking-translation-matters-in-dubai', text: 'Why Real Estate and Banking Document Translation Matters in Dubai', level: 2 },
      { id: 'key-real-estate-and-banking-documents-requiring-certified-translation', text: 'Key Real Estate and Banking Documents Requiring Certified Translation', level: 2 },
      { id: '1-mortgage-and-loan-agreements', text: '1. Mortgage and Loan Agreements', level: 3 },
      { id: '2-title-deeds-and-property-registration-documents', text: '2. Title Deeds and Property Registration Documents', level: 3 },
      { id: '3-bank-statements', text: '3. Bank Statements', level: 3 },
      { id: '4-utility-bills-and-proof-of-address', text: '4. Utility Bills and Proof of Address', level: 3 },
      { id: '5-salary-certificates-and-income-proof', text: '5. Salary Certificates and Income Proof', level: 3 },
      { id: 'the-certified-translation-process-for-financial-and-property-documents', text: 'The Certified Translation Process for Financial and Property Documents', level: 2 },
      { id: 'frequently-asked-questions', text: 'Frequently Asked Questions', level: 2 },
    ];

    await client.query('BEGIN');
    const result = await client.query(
      `UPDATE blog_posts SET
         title = $1,
         slug = $2,
         description = $3,
         content = $4,
         tags = $5,
         meta_title = $6,
         meta_description = $7,
         reading_time = $8,
         schema_markup = $9,
         table_of_contents = $10,
         excerpt = $3,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = 8
       RETURNING id, slug`,
      [
        TITLE,
        SLUG,
        description,
        CONTENT,
        tags,
        metaTitle,
        metaDescription,
        readingTime,
        JSON.stringify(schemaMarkup),
        JSON.stringify(tableOfContents),
      ]
    );

    if (result.rows.length === 0) {
      throw new Error('No row with id=8 found — nothing was updated.');
    }

    await client.query('COMMIT');
    console.log(`✅ Article rewritten: id=8, new slug="${result.rows[0].slug}"`);
    console.log(`   FAQ items parsed: ${faqItems.length}, reading time: ${readingTime} min`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to rewrite article:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
