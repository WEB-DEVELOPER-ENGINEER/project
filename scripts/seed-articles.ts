#!/usr/bin/env npx tsx

/**
 * Production-ready database seed pipeline for the JUSOR translation services app.
 *
 * Reads every .docx article in the `articles/` directory, transforms it into a
 * `blog_posts` row (HTML content, deterministic slug, SEO metadata, computed
 * reading time, inferred category, etc.) and upserts the result in PostgreSQL.
 *
 * Design goals
 *   - Idempotent: safe to re-run, no duplicate slugs, ON CONFLICT upsert.
 *   - Schema-compliant: maps every field the application expects, including
 *     legacy fields (`author`, `description`) and enhanced fields
 *     (`excerpt`, `meta_title`, `meta_description`, `tags`, `related_services`,
 *     `reading_time`, `featured`, `schema_markup`, etc.).
 *   - Deterministic: same input file -> same slug, same category, same dates.
 *   - Resilient: per-file error handling, clear logging, transactions.
 *   - Self-contained: uses only packages already in the project's dependency
 *     graph (`yauzl`, `fast-xml-parser`, `pg`, `dotenv`).
 *
 * Usage:
 *   npx tsx scripts/seed-articles.ts                 # seed all
 *   npx tsx scripts/seed-articles.ts --dry-run       # parse only, do not write
 *   npx tsx scripts/seed-articles.ts --file <name>    # seed a single file
 */

import * as fs from 'fs'
import * as path from 'path'
import yauzl from 'yauzl'
import { XMLParser } from 'fast-xml-parser'
import { pool } from '../lib/database'

/* -------------------------------------------------------------------------- */
/*                              CLI configuration                             */
/* -------------------------------------------------------------------------- */

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const FILE_FLAG = args.indexOf('--file')
const SINGLE_FILE = FILE_FLAG >= 0 ? args[FILE_FLAG + 1] : null

const PROJECT_ROOT = path.resolve(__dirname, '..')
const ARTICLES_DIR = path.join(PROJECT_ROOT, 'articles')

/* -------------------------------------------------------------------------- */
/*                                Type models                                 */
/* -------------------------------------------------------------------------- */

interface ParsedRun {
  text: string
  bold: boolean
  italic: boolean
  underline: boolean
  isHyperlink: boolean
  href?: string
}

interface ParsedParagraph {
  /** Plain text content of the paragraph */
  text: string
  /** Formatted runs (preserves bold/italic/links) */
  runs: ParsedRun[]
  /** Is this paragraph a list item? */
  isListItem: boolean
  /** Is this paragraph a heading (bold, short, ends without punctuation) */
  isHeading: boolean
  /** Heading level (h1=1, h2=2, h3=3) inferred from style + length */
  headingLevel: number
  /** Is this paragraph a horizontal-rule-only block (e.g. an image separator)? */
  isSeparator: boolean
  /** True if the paragraph is in RTL direction (Arabic content) */
  isRtl: boolean
  /** True if this paragraph is the article title (first non-empty heading) */
  isArticleTitle: boolean
  /** True if this paragraph is a navigation breadcrumb to be skipped */
  isBreadcrumb: boolean
}

interface ParsedDocx {
  /** Filename without extension - useful for deterministic slugs */
  fileBaseName: string
  /** The article title (first meaningful paragraph) */
  title: string
  /** All paragraphs in the document body */
  paragraphs: ParsedParagraph[]
  /** ISO timestamp from docProps/core.xml `dcterms:created` */
  createdAt: string | null
  /** ISO timestamp from docProps/core.xml `dcterms:modified` */
  modifiedAt: string | null
  /** Document language hint (e.g. "ar" if any paragraph is RTL) */
  language: 'en' | 'ar' | 'mixed'
}

interface BlogPostSeed {
  title: string
  slug: string
  description: string
  content: string
  excerpt: string
  image_url: string | null
  author: string
  author_id: number | null
  published_date: string
  is_published: boolean
  featured: boolean
  reading_time: number
  view_count: number
  category_id: number | null
  tags: string[]
  meta_title: string
  meta_description: string
  og_image: string | null
  twitter_image: string | null
  canonical_url: string | null
  schema_markup: Record<string, unknown>
  related_services: string[]
  related_projects: string[]
  table_of_contents: Array<{ id: string; text: string; level: number }>
  social_shares: Record<string, number>
  engagement_metrics: Record<string, unknown>
  is_rtl: boolean
  source_file: string
}

/* -------------------------------------------------------------------------- */
/*                          .docx -> structured XML                          */
/* -------------------------------------------------------------------------- */

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: false,
  parseTagValue: false,
  trimValues: false,
  textNodeName: '#text',
})

/**
 * Read the content of a single file inside a .docx (zip) archive.
 * Returns a promise of the file's UTF-8 string content.
 */
function readDocxEntry(filePath: string, entryName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err)
      zipfile.readEntry()
      zipfile.on('entry', (entry) => {
        if (entry.fileName === entryName) {
          zipfile.openReadStream(entry, (err, stream) => {
            if (err) return reject(err)
            const chunks: Uint8Array[] = []
        stream.on('data', (c) => chunks.push(c as Uint8Array))
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
            stream.on('error', reject)
          })
        } else {
          zipfile.readEntry()
        }
      })
      zipfile.on('end', () => reject(new Error(`Entry not found: ${entryName}`)))
      zipfile.on('error', reject)
    })
  })
}

/* -------------------------------------------------------------------------- */
/*                       XML -> structured paragraphs                         */
/* -------------------------------------------------------------------------- */

function readDocxIsoDate(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>
    const text = v['#text']
    if (typeof text === 'string' && text.length > 0) return text
  }
  return null
}

function asArray<T>(v: T | T[] | undefined | null): T[] {
  if (v == null) return []
  return Array.isArray(v) ? v : [v]
}

function runText(t: unknown): string {
  if (typeof t === 'string') return t
  if (t && typeof t === 'object' && '#text' in (t as Record<string, unknown>)) {
    const v = (t as Record<string, unknown>)['#text']
    return typeof v === 'string' ? v : ''
  }
  return ''
}

function isBoldish(rPr: any): boolean {
  if (!rPr) return false
  return 'w:b' in rPr || 'w:bCs' in rPr
}

function isItalicish(rPr: any): boolean {
  if (!rPr) return false
  return 'w:i' in rPr || 'w:iCs' in rPr
}

function isUnderlineish(rPr: any): boolean {
  if (!rPr) return false
  return 'w:u' in rPr
}

function isRtl(pPr: any, rPr: any): boolean {
  // `w:bidi` is an empty element (`<w:bidi/>`), which means it parses to an
  // empty string. Empty string is falsy, so we must test for the *presence*
  // of the key rather than its truthiness.
  if (pPr && ('w:bidi' in pPr || 'w:rtl' in pPr)) return true
  if (rPr && 'w:rtl' in rPr) return true
  return false
}

/**
 * Extract ordered runs from a w:p element. A run can come from a top-level
 * `w:r` element or nested inside a `w:hyperlink`.
 */
function extractRuns(p: any): ParsedRun[] {
  const runs: ParsedRun[] = []
  const children = p ? Object.keys(p).filter((k) => k.startsWith('w:')) : []
  void children

  // We need to traverse top-level w:p children in document order. fast-xml-parser
  // returns an object keyed by element name, so we re-iterate the raw keys of
  // the paragraph using a lightweight approach: walk `w:r` and `w:hyperlink`.
  for (const key of Object.keys(p || {})) {
    if (key === 'w:r') {
      const rs = asArray(p[key])
      for (const r of rs) {
        if (!r || !r['w:t']) continue
        const rPr = r['w:rPr']
        runs.push({
          text: runText(r['w:t']),
          bold: isBoldish(rPr),
          italic: isItalicish(rPr),
          underline: isUnderlineish(rPr),
          isHyperlink: false,
        })
      }
    } else if (key === 'w:hyperlink') {
      const links = asArray(p[key])
      for (const link of links) {
        const innerRuns = asArray(link['w:r'])
        for (const r of innerRuns) {
          if (!r || !r['w:t']) continue
          const rPr = r['w:rPr']
          runs.push({
            text: runText(r['w:t']),
            bold: isBoldish(rPr),
            italic: isItalicish(rPr),
            underline: isUnderlineish(rPr),
            isHyperlink: true,
            href: undefined,
          })
        }
      }
    }
  }
  return runs
}

function isListItemParagraph(pPr: any): boolean {
  return Boolean(pPr && pPr['w:numPr'])
}

/**
 * Heuristic heading detection: bold paragraph whose text is short (< 200 chars),
 * does not end with a period, and is not a list item. Also recognise paragraphs
 * whose `w:pStyle` starts with `Heading` (Word built-in heading styles).
 */
function detectHeading(p: any, text: string, isList: boolean): { isHeading: boolean; level: number } {
  if (isList) return { isHeading: false, level: 0 }
  const pPr = p['w:pPr'] || {}
  const pStyle = pPr['w:pStyle']
  if (pStyle && typeof pStyle === 'object' && pStyle['@_w:val']) {
    const style = String(pStyle['@_w:val'])
    if (/^Heading\d/i.test(style)) {
      const m = style.match(/^Heading(\d)/i)
      const lvl = m ? Math.min(6, Math.max(1, parseInt(m[1], 10))) : 2
      return { isHeading: true, level: lvl }
    }
    if (/^Title$/i.test(style)) {
      return { isHeading: true, level: 1 }
    }
  }
  const runs = extractRuns(p)
  if (runs.length === 0) return { isHeading: false, level: 0 }
  const allBold = runs.every((r) => r.text === '' || r.bold)
  const trimmed = text.trim()
  if (!allBold) return { isHeading: false, level: 0 }
  if (trimmed.length === 0 || trimmed.length > 200) return { isHeading: false, level: 0 }
  if (/[.!?]$/.test(trimmed)) return { isHeading: false, level: 0 }
  if (/^https?:\/\//i.test(trimmed)) return { isHeading: false, level: 0 }
  if (trimmed.startsWith('📞') || trimmed.startsWith('📧') || trimmed.startsWith('🌐') || trimmed.startsWith('📍')) {
    return { isHeading: false, level: 0 }
  }
  return { isHeading: true, level: 2 }
}

/**
 * Convert a single w:p element into a ParsedParagraph.
 */
function parseParagraph(p: any): ParsedParagraph {
  const pPr = p['w:pPr'] || {}
  const runs = extractRuns(p)
  const text = runs.map((r) => r.text).join('').replace(/\u00A0/g, ' ').trim()
  const isList = isListItemParagraph(pPr)
  const { isHeading, level } = detectHeading(p, text, isList)
  const rtl = isRtl(pPr, runs[0])
  return {
    text,
    runs,
    isListItem: isList,
    isHeading,
    headingLevel: level,
    isSeparator: text.length === 0 && !isList,
    isRtl: rtl,
    isArticleTitle: false,
    isBreadcrumb: false,
  }
}

/* -------------------------------------------------------------------------- */
/*                      DOCX -> HTML conversion (server)                     */
/* -------------------------------------------------------------------------- */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function runsToHtml(runs: ParsedRun[]): string {
  if (runs.length === 0) return ''
  return runs
    .map((r) => {
      let html = escapeHtml(r.text)
      if (!html) return ''
      if (r.bold) html = `<strong>${html}</strong>`
      if (r.italic) html = `<em>${html}</em>`
      if (r.underline) html = `<u>${html}</u>`
      return html
    })
    .join('')
}

/**
 * Build a regex that matches any character that is NOT a letter or digit,
 * working in ES5 environments (no \p{L}/\p{N} escapes).
 * Includes ASCII letters/digits plus common Unicode letter/digit ranges for
 * Arabic, Latin Extended, Cyrillic, etc.
 */
const NON_WORD_REGEX = /[^A-Za-z0-9\u00C0-\u024F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s-]+/g

function slugifyAnchor(text: string): string {
  return text
    .toLowerCase()
    .replace(NON_WORD_REGEX, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function paragraphsToHtml(paragraphs: ParsedParagraph[]): {
  html: string
  tableOfContents: Array<{ id: string; text: string; level: number }>
} {
  const toc: Array<{ id: string; text: string; level: number }> = []
  const anchorCounts = new Map<string, number>()
  const htmlParts: string[] = []

  for (const p of paragraphs) {
    if (p.isArticleTitle || p.isBreadcrumb) {
      // Title is rendered separately by the page hero; breadcrumb is
      // navigational and not part of the article body.
      continue
    }
    if (p.isSeparator) {
      htmlParts.push('<hr/>')
      continue
    }
    const inner = runsToHtml(p.runs)
    if (!inner && !p.isListItem) {
      // Preserve empty paragraphs as a blank line for layout fidelity
      htmlParts.push('<p></p>')
      continue
    }

    if (p.isHeading) {
      const baseAnchor = slugifyAnchor(p.text) || `section-${toc.length + 1}`
      const seen = anchorCounts.get(baseAnchor) ?? 0
      anchorCounts.set(baseAnchor, seen + 1)
      const id = seen === 0 ? baseAnchor : `${baseAnchor}-${seen + 1}`
      toc.push({ id, text: p.text, level: p.headingLevel })
      const tag = `h${Math.min(6, Math.max(2, p.headingLevel))}`
      const dir = p.isRtl ? ' dir="rtl"' : ''
      htmlParts.push(`<${tag} id="${id}"${dir}>${inner}</${tag}>`)
      continue
    }

    if (p.isListItem) {
      htmlParts.push(`<li>${inner}</li>`)
      continue
    }

    const dir = p.isRtl ? ' dir="rtl"' : ''
    htmlParts.push(`<p${dir}>${inner}</p>`)
  }

  // Group consecutive <li> elements into a single <ul> for valid HTML
  const grouped: string[] = []
  let inList = false
  for (const part of htmlParts) {
    if (part.startsWith('<li>')) {
      if (!inList) {
        grouped.push('<ul>')
        inList = true
      }
      grouped.push(part)
    } else {
      if (inList) {
        grouped.push('</ul>')
        inList = false
      }
      grouped.push(part)
    }
  }
  if (inList) grouped.push('</ul>')

  return { html: grouped.join('\n'), tableOfContents: toc }
}

/* -------------------------------------------------------------------------- */
/*                                DOCX parsing                                */
/* -------------------------------------------------------------------------- */

async function parseDocx(filePath: string): Promise<ParsedDocx> {
  const fileBaseName = path.basename(filePath, path.extname(filePath))

  // word/document.xml is the main body
  const documentXml = await readDocxEntry(filePath, 'word/document.xml')
  // docProps/core.xml holds creation/modification timestamps
  let coreXml = ''
  try {
    coreXml = await readDocxEntry(filePath, 'docProps/core.xml')
  } catch {
    // Some docx files might not include it; we tolerate that gracefully.
  }

  const doc = xmlParser.parse(documentXml)
  const body = doc['w:document']?.['w:body'] || {}
  const rawParagraphs = asArray(body['w:p'])
  const paragraphs = rawParagraphs.map(parseParagraph)

  let createdAt: string | null = null
  let modifiedAt: string | null = null
  if (coreXml) {
    const core = xmlParser.parse(coreXml)
    const createdRaw = core?.['cp:coreProperties']?.['dcterms:created']
    const modifiedRaw = core?.['cp:coreProperties']?.['dcterms:modified']
    createdAt = readDocxIsoDate(createdRaw)
    modifiedAt = readDocxIsoDate(modifiedRaw)
  }

  // First, mark all breadcrumb-like paragraphs so they are excluded from the
  // body and from the table of contents.
  const breadcrumbMarkers = ['»', '>>']
  for (const p of paragraphs) {
    if (!p.text) continue
    if (breadcrumbMarkers.some((m) => p.text.includes(m)) && p.text.length < 220) {
      p.isBreadcrumb = true
    }
  }

  // Determine title: first non-empty, non-breadcrumb paragraph.
  let title = ''
  for (const p of paragraphs) {
    if (p.isSeparator || p.isBreadcrumb) continue
    if (!p.text) continue
    if (p.text.length < 5) continue
    title = p.text
    p.isArticleTitle = true
    break
  }
  if (!title) title = fileBaseName

  // Determine dominant language
  const rtlCount = paragraphs.filter((p) => p.isRtl && p.text).length
  const totalText = paragraphs.filter((p) => p.text).length
  const language: ParsedDocx['language'] =
    rtlCount === 0 ? 'en' : rtlCount >= totalText / 2 ? 'ar' : 'mixed'

  return {
    fileBaseName,
    title,
    paragraphs,
    createdAt,
    modifiedAt,
    language,
  }
}

export { parseDocx, buildSeedFromDocx }

/* -------------------------------------------------------------------------- */
/*                  Article -> BlogPost transformation                       */
/* -------------------------------------------------------------------------- */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://jusortrans.com'

const DEFAULT_AUTHOR_NAME = 'JUSOR Team'

/* ------------------------------ Slugs ----------------------------------- */

/**
 * Deterministic slug generator.
 * - English: kebab-case using the title.
 * - Arabic: transliteration is not reliable, so we keep a sanitised version
 *   of the title in Latin transliteration when the title is in Arabic. Because
 *   true transliteration is out of scope, we instead fall back to a stable
 *   hash-derived slug from the file basename.
 */
function deterministicSlug(parsed: ParsedDocx): string {
  const title = parsed.title
  const isArabic = /[\u0600-\u06FF]/.test(title)

  if (!isArabic) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 200)
  }

  // For Arabic titles, derive a stable slug from the file basename.
  // This ensures deterministic, ASCII-only slugs that are unique per file.
  const baseSlug = parsed.fileBaseName
    .replace(/\.docx$/i, '')
    .replace(NON_WORD_REGEX, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 200)

  if (baseSlug) return baseSlug

  // Final fallback: hash from the title for stability
  return 'article-' + simpleHash(title).toString(16)
}

function simpleHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/* -------------------------- Excerpt / description ------------------------ */

function firstParagraphText(paragraphs: ParsedParagraph[]): string {
  for (const p of paragraphs) {
    if (p.isSeparator || p.isBreadcrumb || p.isArticleTitle) continue
    if (!p.text) continue
    if (p.isHeading) continue
    if (p.isListItem) continue
    if (p.text.length < 80) continue
    // Skip paragraphs that look like the post-title tagline (entirely italic).
    if (p.runs.length > 0 && p.runs.every((r) => !r.text || r.italic)) continue
    return p.text
  }
  // Fallback: take the first long enough non-heading paragraph even if italic.
  for (const p of paragraphs) {
    if (p.isSeparator || p.isBreadcrumb || p.isArticleTitle) continue
    if (!p.text) continue
    if (p.isHeading) continue
    if (p.text.length < 80) continue
    return p.text
  }
  return ''
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  const slice = s.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim() + '…'
}

function buildExcerpt(text: string, max = 220): string {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= max) return cleaned
  const slice = cleaned.slice(0, max)
  const lastPunc = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('، '), slice.lastIndexOf('; '))
  if (lastPunc > 80) return slice.slice(0, lastPunc + 1).trim()
  return truncate(slice, max)
}

function buildMetaTitle(title: string, isArabic: boolean): string {
  // The root layout title template appends the site name, so this must not.
  const suffix = ''
  // Note: many of these article titles share the same opening words
  // ("Certified Legal Translation for ..."), so the truncation budget must
  // be generous enough to preserve the distinguishing part of the title —
  // otherwise multiple articles collapse to an identical, duplicate
  // <title> tag (a real SEO defect: search engines penalize duplicate
  // titles across distinct pages). The shared prefixes here run up to
  // ~48 chars before the distinguishing topic starts, so the budget needs
  // real headroom past that — 100 chars reliably reaches a unique word for
  // every article in this set (verified against all current titles).
  // Search engines will simply display a shorter version in results; the
  // underlying <title> tag stays genuinely unique per page, which matters
  // more than exact SERP pixel width.
  const max = 100
  const maxTitle = max - suffix.length
  if (title.length <= maxTitle) return title + suffix
  return truncate(title, maxTitle) + suffix
}

function buildMetaDescription(excerpt: string, isArabic: boolean): string {
  const suffix = isArabic
    ? ' خدمات ترجمة قانونية معتمدة في دبي.'
    : ' Certified translation services in Dubai.'
  const max = 160
  const target = excerpt.endsWith('.') || excerpt.endsWith('。') ? excerpt.slice(0, -1) : excerpt
  const candidate = target + suffix
  if (candidate.length <= max) return candidate
  return truncate(target, max - suffix.length) + suffix
}

/* ------------------------------- Tags ----------------------------------- */

const TAG_KEYWORDS: Array<{ tag: string; patterns: RegExp[] }> = [
  { tag: 'Legal Translation', patterns: [/legal/i, /قانوني/] },
  { tag: 'Certified Translation', patterns: [/certified/i, /معتمد/] },
  { tag: 'Dubai', patterns: [/dubai/i, /دبي/] },
  { tag: 'MOHRE', patterns: [/MOHRE/, /ministry of human resources/i, /وزارة الموارد/] },
  { tag: 'UAE', patterns: [/UAE/, /emirates/i, /الإمارات/] },
  { tag: 'Court Documents', patterns: [/court/i, /محكمة/, /judgment/i, /arbitration/i, /تحكيم/] },
  { tag: 'Contracts', patterns: [/contract/i, /عقد/] },
  { tag: 'Compliance', patterns: [/compliance/i, /regulatory/i, /امتثال/] },
  { tag: 'Tax & VAT', patterns: [/tax/i, /VAT/i, /ضريبة/] },
  { tag: 'Real Estate', patterns: [/real estate/i, /mortgage/i, /عقار/] },
  { tag: 'Aviation', patterns: [/aviation/i, /aircraft/i, /طيران/] },
  { tag: 'Energy & Oil', patterns: [/energy/i, /oil/i, /gas/i, /طاقة/, /نفط/] },
  { tag: 'Insurance', patterns: [/insurance/i, /reinsurance/i, /تأمين/] },
  { tag: 'ESG', patterns: [/ESG/i, /sustainability/i, /استدامة/] },
  { tag: 'Banking', patterns: [/bank/i, /مصرف/] },
  { tag: 'Visa & Immigration', patterns: [/visa/i, /immigration/i, /golden visa/i, /تأشيرة/] },
  { tag: 'Tourism', patterns: [/tourist/i, /tourism/i, /سياحة/] },
  { tag: 'Corporate Governance', patterns: [/corporate governance/i, /anti-bribery/i, /حوكمة/] },
  { tag: 'Restructuring', patterns: [/restructur/i, /insolvency/i, /bankruptcy/i, /إفلاس/] },
  { tag: 'Wealth Management', patterns: [/wealth/i, /sovereign/i, /trust/i, /ثروة/, /صناديق سيادية/] },
  { tag: 'Franchise', patterns: [/franchise/i, /distribution/i, /agency/i, /امتياز/] },
  { tag: 'Attestation', patterns: [/attestation/i, /MOFA/i, /MOJ/i, /تصديق/, /كاتب العدل/] },
  { tag: 'HR & Employment', patterns: [/employment/i, /HR\b/, /human resources/i, /توظيف/, /عمل/] },
  { tag: 'Claims', patterns: [/claim/i, /defense brief/i, /دعوى/, /مذكرات/] },
]

function buildTags(title: string, fullText: string): string[] {
  const haystack = `${title}\n${fullText}`
  const matched = new Set<string>()
  for (const { tag, patterns } of TAG_KEYWORDS) {
    if (patterns.some((p) => p.test(haystack))) matched.add(tag)
  }
  if (matched.size === 0) matched.add('Translation')
  return Array.from(matched).slice(0, 8)
}

/* -------------------------- Category inference -------------------------- */

const CATEGORY_RULES: Array<{ slug: string; patterns: RegExp[] }> = [
  { slug: 'legal', patterns: [/legal/i, /قانوني/, /محكمة/, /court/i, /arbitration/i, /تحكيم/] },
  { slug: 'technical', patterns: [/technical/i, /engineering/i, /aviation/i, /aircraft/i, /oil/i, /gas/i, /energy/i, /طيران/, /طاقة/] },
  { slug: 'business', patterns: [/business/i, /corporate/i, /commercial/i, /توكيل/, /فرانشايز/] },
  { slug: 'medical', patterns: [/medical/i, /pharmaceutical/i, /طبي/] },
  { slug: 'academic', patterns: [/academic/i, /thesis/i, /أبحاث/] },
  { slug: 'insights', patterns: [/guide/i, /insight/i, /overview/i, /دليل/] },
  { slug: 'general', patterns: [/.*/] }, // fallback
]

function inferCategorySlug(title: string, fullText: string): string {
  const haystack = `${title}\n${fullText}`
  for (const rule of CATEGORY_RULES) {
    if (rule === CATEGORY_RULES[CATEGORY_RULES.length - 1]) continue
    if (rule.patterns.some((p) => p.test(haystack))) return rule.slug
  }
  return 'general'
}

/* -------------------------- Reading time -------------------------------- */

function computeReadingTime(html: string): number {
  const text = stripHtml(html)
  // Average reading speed: 200 wpm for English, 150 wpm for Arabic
  const isArabic = /[\u0600-\u06FF]/.test(text)
  const words = text.split(/\s+/).filter(Boolean).length
  const wpm = isArabic ? 150 : 200
  return Math.max(1, Math.ceil(words / wpm))
}

/* -------------------------- Related services ---------------------------- */

// These slugs must match scripts/seed-services.ts's actual catalog —
// updated 2026-07-30 to fix a mismatch where this list referenced slugs
// (e.g. 'certified-translation', 'attestation-services') that don't exist
// in the real seeded services, which silently broke related-service links.
const SERVICE_KEYWORD_RULES: Array<{ slug: string; patterns: RegExp[] }> = [
  { slug: 'certified-document-translation', patterns: [/certified/i, /معتمد/, /apostille/i] },
  { slug: 'legal-translation', patterns: [/legal/i, /\blaw\b/i, /قانوني/] },
  { slug: 'court-litigation-translation', patterns: [/court/i, /arbitration/i, /litigation/i, /محكمة/, /تحكيم/] },
  { slug: 'technical-engineering-translation', patterns: [/technical/i, /engineering/i, /aviation/i, /\boil\b/i, /\bgas\b/i, /energy/i, /طيران/, /طاقة/] },
  { slug: 'financial-business-translation', patterns: [/financial/i, /\btax\b/i, /\bVAT\b/, /bank/i, /ضريبة/, /بنك/] },
  { slug: 'contracts-corporate-document-translation', patterns: [/contract/i, /franchise/i, /corporate governance/i, /عقد/, /فرانشايز/] },
  { slug: 'immigration-visa-translation', patterns: [/attestation/i, /MOFA/i, /MOJ/i, /visa/i, /immigration/i, /golden visa/i, /تصديق/, /تأشيرة/] },
  { slug: 'academic-certificate-translation', patterns: [/academic/i, /diploma/i, /transcript/i, /أكاديمي/] },
  { slug: 'medical-translation', patterns: [/medical/i, /pharmaceutical/i, /طبي/] },
]

function inferRelatedServices(title: string, fullText: string): string[] {
  const haystack = `${title}\n${fullText}`
  const matched = new Set<string>()
  for (const r of SERVICE_KEYWORD_RULES) {
    if (r.patterns.some((p) => p.test(haystack))) matched.add(r.slug)
  }
  return Array.from(matched).slice(0, 6)
}

/* --------------------------- Schema markup ------------------------------- */

function buildSchemaMarkup(opts: {
  title: string
  description: string
  slug: string
  publishedDate: string
  authorName: string
  imageUrl: string | null
  language: 'en' | 'ar' | 'mixed'
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    image: opts.imageUrl ? [opts.imageUrl] : undefined,
    datePublished: opts.publishedDate,
    dateModified: opts.publishedDate,
    inLanguage: opts.language === 'ar' ? 'ar' : 'en',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${opts.slug}`,
    },
    author: {
      '@type': 'Organization',
      name: opts.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'JUSOR Alkalimat Certified & Legal Translation',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/jusor.png`,
      },
    },
  }
}

/* -------------------------------------------------------------------------- */
/*                     Orchestrator: article -> BlogPostSeed                 */
/* -------------------------------------------------------------------------- */

interface CategoryLookup {
  byId: Map<number, { id: number; name: string; slug: string }>
  bySlug: Map<string, { id: number; name: string; slug: string }>
}

interface AuthorLookup {
  byId: Map<number, { id: number; name: string; slug: string }>
  bySlug: Map<string, { id: number; name: string; slug: string }>
}

async function buildSeedFromDocx(
  filePath: string,
  categories: CategoryLookup,
  defaultAuthorId: number | null,
): Promise<BlogPostSeed> {
  const parsed = await parseDocx(filePath)
  const { html, tableOfContents } = paragraphsToHtml(parsed.paragraphs)
  const fullText = stripHtml(html)
  const isArabic = parsed.language === 'ar'

  // Build date
  let publishedDate: string
  if (parsed.createdAt) {
    publishedDate = parsed.createdAt.slice(0, 10)
  } else {
    // Fall back to file modification time, then today
    try {
      const stat = await fs.promises.stat(filePath)
      publishedDate = stat.mtime.toISOString().slice(0, 10)
    } catch {
      publishedDate = new Date().toISOString().slice(0, 10)
    }
  }

  const slug = deterministicSlug(parsed)
  const firstParagraph = firstParagraphText(parsed.paragraphs)
  const descriptionSource = firstParagraph || fullText
  const description = buildExcerpt(descriptionSource, 200)
  const excerpt = buildExcerpt(descriptionSource, 240)
  const tags = buildTags(parsed.title, fullText)
  const categorySlug = inferCategorySlug(parsed.title, fullText)
  const category = categories.bySlug.get(categorySlug) || categories.bySlug.get('general') || null
  const relatedServices = inferRelatedServices(parsed.title, fullText)
  const readingTime = computeReadingTime(html)
  const metaTitle = buildMetaTitle(parsed.title, isArabic)
  const metaDescription = buildMetaDescription(description, isArabic)
  const canonicalUrl = `${BASE_URL}/blog/${slug}`
  const schemaMarkup = buildSchemaMarkup({
    title: parsed.title,
    description: metaDescription,
    slug,
    publishedDate,
    authorName: DEFAULT_AUTHOR_NAME,
    imageUrl: null,
    language: parsed.language,
  })

  return {
    title: parsed.title,
    slug,
    description,
    content: html,
    excerpt,
    image_url: null,
    author: DEFAULT_AUTHOR_NAME,
    author_id: defaultAuthorId,
    published_date: publishedDate,
    is_published: true,
    featured: false,
    reading_time: readingTime,
    view_count: 0,
    category_id: category ? category.id : null,
    tags,
    meta_title: metaTitle,
    meta_description: metaDescription,
    og_image: null,
    twitter_image: null,
    canonical_url: canonicalUrl,
    schema_markup: schemaMarkup,
    related_services: relatedServices,
    related_projects: [],
    table_of_contents: tableOfContents,
    social_shares: { facebook: 0, twitter: 0, linkedin: 0 },
    engagement_metrics: { avg_time_on_page: 0, scroll_depth: 0, comments: 0 },
    is_rtl: isArabic,
    source_file: path.relative(PROJECT_ROOT, filePath),
  }
}

/* -------------------------------------------------------------------------- */
/*                          Database upsert helpers                          */
/* -------------------------------------------------------------------------- */

const UPSERT_SQL = `
  INSERT INTO blog_posts (
    title,
    slug,
    description,
    content,
    excerpt,
    image_url,
    author,
    author_id,
    published_date,
    is_published,
    featured,
    reading_time,
    view_count,
    category_id,
    tags,
    meta_title,
    meta_description,
    og_image,
    twitter_image,
    canonical_url,
    schema_markup,
    related_services,
    related_projects,
    table_of_contents,
    social_shares,
    engagement_metrics
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
    $21, $22, $23, $24, $25, $26
  )
  ON CONFLICT (slug) DO UPDATE SET
    title          = EXCLUDED.title,
    description    = EXCLUDED.description,
    content        = EXCLUDED.content,
    excerpt        = EXCLUDED.excerpt,
    image_url      = EXCLUDED.image_url,
    author         = EXCLUDED.author,
    author_id      = EXCLUDED.author_id,
    published_date = EXCLUDED.published_date,
    is_published   = EXCLUDED.is_published,
    featured       = EXCLUDED.featured,
    reading_time   = EXCLUDED.reading_time,
    category_id    = EXCLUDED.category_id,
    tags           = EXCLUDED.tags,
    meta_title     = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    og_image       = EXCLUDED.og_image,
    twitter_image  = EXCLUDED.twitter_image,
    canonical_url  = EXCLUDED.canonical_url,
    schema_markup  = EXCLUDED.schema_markup,
    related_services = EXCLUDED.related_services,
    related_projects = EXCLUDED.related_projects,
    table_of_contents = EXCLUDED.table_of_contents,
    social_shares  = EXCLUDED.social_shares,
    engagement_metrics = EXCLUDED.engagement_metrics,
    updated_at     = CURRENT_TIMESTAMP
  RETURNING id, slug, title, (xmax = 0) AS was_inserted;
`

async function ensureSchemaReady(client: any): Promise<void> {
  // The blog_posts table is pre-existing in production databases and the
  // migration in lib/database.ts only adds columns. We add a unique
  // constraint on slug (if missing) so ON CONFLICT can work idempotently,
  // and expand column lengths so long article titles and slugs fit.
  await client.query(`
    DO $$
    BEGIN
      ALTER TABLE blog_posts ALTER COLUMN title TYPE VARCHAR(500);
      ALTER TABLE blog_posts ALTER COLUMN slug TYPE VARCHAR(500);
      ALTER TABLE blog_posts ALTER COLUMN meta_title TYPE VARCHAR(500);
      ALTER TABLE blog_posts ALTER COLUMN meta_description TYPE VARCHAR(1000);

      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'blog_posts_slug_key'
      ) THEN
        ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);
      END IF;
    END $$;
  `)
}

// The category slugs this script's inferCategorySlug() already assigns to
// articles (see CATEGORY_RULES above). Without matching rows in
// blog_categories, every post silently gets category_id = NULL, which is
// what happens on a freshly-provisioned database. These are organizational
// labels for content that already exists — not business claims — so it's
// safe to seed them here rather than requiring a separate manual step.
const BLOG_CATEGORY_SEEDS: Array<{ name: string; slug: string; description: string; color: string }> = [
  { name: 'Legal Translation', slug: 'legal', description: 'Certified translation for legal, court, and arbitration documents.', color: 'blue' },
  { name: 'Technical & Industry', slug: 'technical', description: 'Translation for aviation, energy, oil & gas, and other technical sectors.', color: 'orange' },
  { name: 'Business & Corporate', slug: 'business', description: 'Translation for corporate, commercial, and franchise agreements.', color: 'green' },
  { name: 'Medical Translation', slug: 'medical', description: 'Translation for medical and pharmaceutical documents.', color: 'red' },
  { name: 'Academic Translation', slug: 'academic', description: 'Translation for academic and research documents.', color: 'purple' },
  { name: 'Guides & Insights', slug: 'insights', description: 'Practical guides on certified translation and attestation procedures.', color: 'teal' },
  { name: 'General', slug: 'general', description: 'General certified translation topics.', color: 'gray' },
]

async function ensureReferenceData(client: any): Promise<void> {
  for (const cat of BLOG_CATEGORY_SEEDS) {
    await client.query(
      `INSERT INTO blog_categories (name, slug, description, color, is_active, sort_order)
       VALUES ($1, $2, $3, $4, true, 0)
       ON CONFLICT (slug) DO NOTHING`,
      [cat.name, cat.slug, cat.description, cat.color]
    )
  }

  // A single non-personal "team" byline, matching the fallback already used
  // in components/sections/blog-post-author.tsx — deliberately not a named
  // individual with invented credentials.
  await client.query(
    `INSERT INTO blog_authors (name, slug, title, bio, is_active, sort_order)
     VALUES ($1, $2, $3, $4, true, 0)
     ON CONFLICT (slug) DO NOTHING`,
    [
      'JUSOR Team',
      'jusor-team',
      'Translation & Localization Experts',
      'Our team of certified translators and localization specialists brings decades of combined experience in delivering high-quality language services across multiple industries.',
    ]
  )
}

async function loadCategories(client: any): Promise<CategoryLookup> {
  const byId = new Map<number, { id: number; name: string; slug: string }>()
  const bySlug = new Map<string, { id: number; name: string; slug: string }>()
  try {
    const res = await client.query('SELECT id, name, slug FROM blog_categories')
    for (const row of res.rows) {
      byId.set(row.id, row)
      bySlug.set(row.slug, row)
    }
  } catch (err) {
    console.warn('  ⚠️  Could not load blog_categories (table may be missing). Articles will be created without a category.')
    console.warn(`     Reason: ${(err as Error).message}`)
  }
  return { byId, bySlug }
}

async function loadAuthors(client: any): Promise<{ lookup: AuthorLookup; defaultAuthorId: number | null }> {
  const byId = new Map<number, { id: number; name: string; slug: string }>()
  const bySlug = new Map<string, { id: number; name: string; slug: string }>()
  try {
    const res = await client.query('SELECT id, name, slug FROM blog_authors')
    for (const row of res.rows) {
      byId.set(row.id, row)
      bySlug.set(row.slug, row)
    }
  } catch (err) {
    console.warn('  ⚠️  Could not load blog_authors. Defaulting author_id to NULL.')
    console.warn(`     Reason: ${(err as Error).message}`)
  }
  const defaultAuthor = bySlug.get('jusor-team') || byId.get(1) || null
  return { lookup: { byId, bySlug }, defaultAuthorId: defaultAuthor ? defaultAuthor.id : null }
}

async function listArticleFiles(): Promise<string[]> {
  const entries = await fs.promises.readdir(ARTICLES_DIR)
  return entries
    .filter((f) => f.toLowerCase().endsWith('.docx') && !f.startsWith('~$'))
    .map((f) => path.join(ARTICLES_DIR, f))
    .sort()
}

async function upsertPost(client: any, seed: BlogPostSeed): Promise<{ id: number; slug: string; action: 'inserted' | 'updated' }> {
  // NOTE: JSON/JSONB columns in node-pg are NOT auto-stringified when the value
  // is an *array of objects* (it is for plain objects). Stringify explicitly
  // for `schema_markup`, `table_of_contents`, `social_shares`,
  // `engagement_metrics`. Text[] columns accept native JS arrays.
  const params = [
    seed.title,
    seed.slug,
    seed.description,
    seed.content,
    seed.excerpt,
    seed.image_url,
    seed.author,
    seed.author_id,
    seed.published_date,
    seed.is_published,
    seed.featured,
    seed.reading_time,
    seed.view_count,
    seed.category_id,
    seed.tags,
    seed.meta_title,
    seed.meta_description,
    seed.og_image,
    seed.twitter_image,
    seed.canonical_url,
    JSON.stringify(seed.schema_markup),
    seed.related_services,
    seed.related_projects,
    JSON.stringify(seed.table_of_contents),
    JSON.stringify(seed.social_shares),
    JSON.stringify(seed.engagement_metrics),
  ]

  // Detect whether this is a new post (xmax = 0 on insert) or an update.
  const result = await client.query(UPSERT_SQL, params)
  const row = result.rows[0]
  const action: 'inserted' | 'updated' = row.was_inserted ? 'inserted' : 'updated'
  return { id: row.id, slug: row.slug, action }
}

/* -------------------------------------------------------------------------- */
/*                                  Main                                      */
/* -------------------------------------------------------------------------- */

async function main() {
  console.log('📚 JUSOR Article Seed Pipeline')
  console.log('='.repeat(60))
  if (DRY_RUN) console.log('  Mode: DRY RUN (no database writes)')
  if (SINGLE_FILE) console.log(`  Single file: ${SINGLE_FILE}`)

  // 1. List input files
  let files: string[]
  if (SINGLE_FILE) {
    const candidate = path.isAbsolute(SINGLE_FILE) ? SINGLE_FILE : path.join(ARTICLES_DIR, SINGLE_FILE)
    if (!fs.existsSync(candidate)) {
      throw new Error(`Article file not found: ${candidate}`)
    }
    files = [candidate]
  } else {
    files = await listArticleFiles()
  }
  console.log(`  Found ${files.length} article file(s)\n`)

  // 2. Parse every file
  const seeds: BlogPostSeed[] = []
  const parseErrors: Array<{ file: string; error: string }> = []
  for (const file of files) {
    const rel = path.relative(PROJECT_ROOT, file)
    try {
      const seed = await buildSeedFromDocx(
        file,
        { byId: new Map(), bySlug: new Map() }, // categories resolved later if writing to DB
        null,
      )
      seeds.push(seed)
      console.log(
        `  ✔ Parsed: ${rel}\n` +
          `      title: ${seed.title}\n` +
          `      slug : ${seed.slug}\n` +
          `      lang : ${seed.is_rtl ? 'ar' : 'en'} | words: ~${seed.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length} | reading: ${seed.reading_time} min`,
      )
    } catch (err) {
      const msg = (err as Error).message
      parseErrors.push({ file: rel, error: msg })
      console.error(`  ✖ Failed: ${rel}: ${msg}`)
    }
  }

  // 3. Validate uniqueness of generated slugs
  const slugCounts = new Map<string, number>()
  for (const s of seeds) slugCounts.set(s.slug, (slugCounts.get(s.slug) ?? 0) + 1)
  const duplicates = Array.from(slugCounts.entries()).filter(([, c]) => c > 1)
  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate slugs detected: ${duplicates.map(([s, c]) => `${s} (x${c})`).join(', ')}`,
    )
  }

  if (DRY_RUN) {
    console.log('\n✅ Dry run complete. No changes written to the database.')
    if (parseErrors.length) {
      console.log(`⚠️  ${parseErrors.length} file(s) failed to parse.`)
      process.exit(2)
    }
    process.exit(0)
  }

  // 4. Database connection and transactions
  const client = await pool.connect()
  const summary = { inserted: 0, updated: 0, failed: 0, parseErrors }
  try {
    await client.query('BEGIN')
    console.log('\n🔧 Preparing schema (ensuring unique slug constraint)…')
    await ensureSchemaReady(client)

    console.log('🔧 Ensuring blog categories and default author exist…')
    await ensureReferenceData(client)

    console.log('🔎 Loading reference data (categories, authors)…')
    const categories = await loadCategories(client)
    const authors = await loadAuthors(client)
    console.log(`  - ${categories.bySlug.size} blog categor(ies) loaded`)
    console.log(`  - ${authors.lookup.bySlug.size} blog author(s) loaded`)

    // Re-resolve category_id for each seed now that we have real IDs
    for (const seed of seeds) {
      const title = seed.title
      const fullText = stripHtml(seed.content)
      const categorySlug = inferCategorySlug(title, fullText)
      const category = categories.bySlug.get(categorySlug) || categories.bySlug.get('general') || null
      seed.category_id = category ? category.id : null
      const defaultAuthor = authors.lookup.bySlug.get('jusor-team') || authors.lookup.byId.get(1) || null
      seed.author_id = defaultAuthor ? defaultAuthor.id : null
    }

    console.log('\n📥 Upserting blog posts…')
    for (const seed of seeds) {
      try {
        const { action } = await upsertPost(client, seed)
        if (action === 'inserted') summary.inserted++
        else summary.updated++
        console.log(`  ${action === 'inserted' ? '＋' : '↻'} ${seed.slug}`)
      } catch (err) {
        summary.failed++
        console.error(`  ✖ Failed to upsert ${seed.slug}: ${(err as Error).message}`)
      }
    }

    await client.query('COMMIT')
    console.log('\n✅ Transaction committed successfully.')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => undefined)
    console.error('\n❌ Transaction failed, rolled back.')
    throw err
  } finally {
    client.release()
    await pool.end().catch(() => undefined)
  }

  console.log('\n📊 Summary')
  console.log('='.repeat(60))
  console.log(`  Inserted: ${summary.inserted}`)
  console.log(`  Updated : ${summary.updated}`)
  console.log(`  Failed  : ${summary.failed}`)
  if (summary.parseErrors.length) {
    console.log(`  Parse errors: ${summary.parseErrors.length}`)
    for (const e of summary.parseErrors) console.log(`    - ${e.file}: ${e.error}`)
  }
  console.log('')
  if (summary.failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error('💥 Seed pipeline failed:', err)
  process.exit(1)
})
