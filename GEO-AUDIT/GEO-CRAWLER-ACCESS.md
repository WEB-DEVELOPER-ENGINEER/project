# AI Crawler Access Report: jusortrans.com

**Analysis Date:** 2026-06-25
**Domain:** jusortrans.com
**robots.txt Status:** Found

---

## Crawler Access Summary

| Crawler | Operator | Tier | Status | Impact |
|---|---|---|---|---|
| GPTBot | OpenAI | 1 | **Blocked** | Content will NOT appear in ChatGPT Search results or be accessible when users ask ChatGPT to browse the web. This is a critical block for AI visibility. |
| OAI-SearchBot | OpenAI | 1 | Allowed | Content can appear in ChatGPT's search results. |
| ChatGPT-User | OpenAI | 1 | **Blocked** | ChatGPT cannot visit pages when users ask it to read or summarize them, preventing direct user-initiated traffic. This is a critical block. |
| ClaudeBot | Anthropic | 1 | Allowed | Content is accessible to Claude for web search and analysis. |
| PerplexityBot | Perplexity AI | 1 | Allowed | Content can appear in Perplexity search results, potentially driving referral traffic. |
| Google-Extended | Google | 2 | Allowed | Content may be used for Gemini model training and AI Overviews improvement. |
| GoogleOther | Google | 2 | Allowed | Content may be used for Google's AI research and experimental features. |
| Applebot-Extended | Apple | 2 | Allowed | Content may be used in Apple Intelligence features. |
| Amazonbot | Amazon | 2 | Allowed | Content can appear in Alexa voice responses and Amazon's AI features. |
| FacebookBot | Meta | 2 | Allowed | Content may be accessible to Meta AI. |
| CCBot | Common Crawl | 3 | **Blocked** | Content will not appear in future Common Crawl datasets. No impact on live AI search products. |
| anthropic-ai | Anthropic | 3 | **Blocked** | Content will not be used for Claude training. No impact on Claude's live search or web browsing features. |
| Bytespider | ByteDance | 3 | Allowed | Content may be used for ByteDance AI products. (Note: Recommendation is generally to BLOCK this bot). |
| cohere-ai | Cohere | 3 | Allowed | Content may be used for Cohere model training. |

## AI Visibility Score: 75/100

**Tier 1 Access:** 3/5 crawlers allowed
**Tier 2 Access:** 5/5 crawlers allowed
**Tier 3 Access:** 2/4 crawlers allowed

---

## Critical Issues

*   **GPTBot (Tier 1) is blocked:** This significantly reduces visibility in ChatGPT's search and browsing features, impacting a large user base.
*   **ChatGPT-User (Tier 1) is blocked:** This prevents direct user-initiated content access via ChatGPT, hindering user engagement.

## Recommendations

### Immediate Actions
To maximize AI search visibility, it is critical to unblock `GPTBot` and `ChatGPT-User` in your `robots.txt` file.

### robots.txt Recommendation
The following `robots.txt` configuration is recommended to maximize AI visibility while maintaining existing site-specific disallows and respecting the current strategy for training-only bots:

```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# AI Crawlers - ALLOWED for AI search visibility
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: cohere-ai
Allow: /

# AI Crawlers - BLOCKED (aggressive/low value or training-only based on current site strategy)
User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

Host: https://jusortrans.com
Sitemap: https://jusortrans.com/sitemap.xml
```

### Additional Technical Findings
-   **Meta Robots Tags:** The site uses `<meta name="robots" content="index, follow">`, which is optimal for crawler access and does not contain any `noindex` or `noai` directives.
-   **X-Robots-Tag Headers:** No `X-Robots-Tag` HTTP headers were found that would restrict AI crawler access (e.g., `noindex`, `noai`).
-   **JavaScript Rendering:** The site is served by Vercel and likely a Next.js application (indicated by `Disallow: /_next/` in `robots.txt`). While Next.js often uses Server-Side Rendering (SSR) or Static Site Generation (SSG) which is crawler-friendly, if critical content relies heavily on client-side JavaScript fetching after the initial page load, some AI crawlers (e.g., GPTBot, ClaudeBot, PerplexityBot) with limited JavaScript rendering capabilities might not fully access or index that content.
-   **llms.txt:** Absent. This emerging standard can provide more granular control over AI crawler access.
-   **Sitemap Accessibility:** A sitemap is declared in `robots.txt` at `https://jusortrans.com/sitemap.xml`. Assuming this sitemap is valid and accessible, it aids AI crawlers in content discovery.

### Content Signals (IETF Draft)

**Status:** Absent

**Recommendation:** Add a `Content-Signal:` directive to `robots.txt` to declare AI usage preferences explicitly. This provides a clear signal to AI systems about how your content should be used. Example:

`Content-Signal: ai-train=no, search=yes, ai-retrieval=yes`

See https://contentsignals.org/ for the full specification.