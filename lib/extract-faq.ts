/**
 * Extracts real Q&A pairs already present in blog post body HTML so they can
 * be exposed as FAQPage structured data (see app/blog/[slug]/page.tsx).
 *
 * The seeded articles (scripts/seed-articles.ts) consistently include a
 * "Frequently Asked Questions" section, but the two languages use different
 * HTML shapes:
 *   - English: one <h2 id="frequently-asked-questions"> section header,
 *     followed by repeated <p><strong>N. Question?</strong></p> blocks, each
 *     followed by one or more <p>/<ul>/<ol> answer elements.
 *   - Arabic: each question is its own <h2> (heading id starts with a
 *     number, e.g. id="1-..."), immediately followed by its answer
 *     element(s).
 *
 * This walks the real DOM (via jsdom) rather than fabricating anything —
 * it only surfaces content that already exists in the article.
 */

import { JSDOM } from 'jsdom';

export interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_HEADING_PATTERN = /frequently asked questions|الأسئلة الشائعة/i;
const NUMBERED_QUESTION_PATTERN = /^\s*\d+[.\-)]\s*(.+)$/;

function textOf(el: Element): string {
  return (el.textContent || '').replace(/\s+/g, ' ').trim();
}

export function extractFaqItems(contentHtml: string): FaqItem[] {
  if (!contentHtml || typeof contentHtml !== 'string') return [];

  let dom: JSDOM;
  try {
    dom = new JSDOM(`<div id="root">${contentHtml}</div>`);
  } catch {
    return [];
  }

  const root = dom.window.document.getElementById('root');
  if (!root) return [];

  const headings = Array.from(root.querySelectorAll('h1, h2, h3'));
  const faqHeading = headings.find((h) => FAQ_HEADING_PATTERN.test(textOf(h)));
  if (!faqHeading) return [];

  const items: FaqItem[] = [];
  let node: Element | null = faqHeading.nextElementSibling;
  let currentQuestion: string | null = null;
  let currentAnswerParts: string[] = [];

  const flush = () => {
    if (currentQuestion && currentAnswerParts.length > 0) {
      items.push({
        question: currentQuestion,
        answer: currentAnswerParts.join(' ').trim(),
      });
    }
    currentQuestion = null;
    currentAnswerParts = [];
  };

  while (node) {
    const tag = node.tagName.toLowerCase();

    // A horizontal rule marks the end of the FAQ block in these articles.
    if (tag === 'hr') break;

    if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      const text = textOf(node);
      const match = NUMBERED_QUESTION_PATTERN.exec(text);
      if (match) {
        // Arabic case: the question itself is a heading.
        flush();
        currentQuestion = match[1].trim();
        node = node.nextElementSibling;
        continue;
      }
      // A non-question, non-FAQ heading means the FAQ section has ended.
      break;
    }

    if (tag === 'p') {
      const strong = node.querySelector('strong');
      const strongText = strong ? textOf(strong) : '';
      const match = NUMBERED_QUESTION_PATTERN.exec(strongText);
      if (match && strongText.length === textOf(node).length) {
        // English case: a <p> whose entire content is a numbered <strong> question.
        flush();
        currentQuestion = match[1].trim();
        node = node.nextElementSibling;
        continue;
      }
      if (currentQuestion) {
        currentAnswerParts.push(textOf(node));
      }
    } else if ((tag === 'ul' || tag === 'ol') && currentQuestion) {
      const items2 = Array.from(node.querySelectorAll('li')).map((li) => textOf(li));
      currentAnswerParts.push(items2.join('. '));
    }

    node = node.nextElementSibling;
  }
  flush();

  return items.filter((item) => item.question.length > 0 && item.answer.length > 0);
}
