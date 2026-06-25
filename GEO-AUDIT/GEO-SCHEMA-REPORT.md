## Schema & Structured Data

**Schema Score: 5/100** Critical

### Detected Structured Data

**Total Schema Blocks Found:** 0
**Format(s) Used:** None

| # | Type | Format | Valid | Rich Result Eligible |
|---|---|---|---|---|
| - | No structured data found | - | - | - |

### Validation Results

No structured data blocks were detected on the page to validate.

### GEO-Critical Schema Assessment

| Schema | Status | GEO Impact | Notes |
|---|---|---|---|
| Organization + sameAs | Missing | Critical | No Organization or LocalBusiness schema found. This is crucial for AI models to understand the entity behind the website and link it to other online presences. |
| Person (author) | Missing | High | No Person schema found. While this page is likely a service page, if there are authors for blog posts or "About Us" sections, Person schema is vital for E-E-A-T. |
| Article + dateModified | Missing | High | No Article, BlogPosting, or other content-specific schema found. This prevents AI models from fully understanding the page's content, publication details, and authorship. |
| speakable | Missing | Medium | The `speakable` property is not present. This means the page is not explicitly marked up for AI assistant consumption or text-to-speech features. |
| BreadcrumbList | Missing | Low | No BreadcrumbList schema found. This helps search engines understand the site's hierarchy and can enable breadcrumb rich results. |
| WebSite + SearchAction | Missing | Low | No WebSite schema with `SearchAction` found. This prevents the potential for a sitelinks search box in search results. |

### sameAs Entity Linking

**Current sameAs links found:** 0

| Platform | Linked | URL |
|---|---|---|
| Wikipedia | No | Not linked |
| Wikidata | No | Not linked |
| LinkedIn | No | Not linked |
| YouTube | No | Not linked |
| Crunchbase | No | Not linked |
| Twitter/X | No | Not linked |
| GitHub | No | Not linked |

### Deprecated/Restricted Schemas

None found

### JavaScript Rendering Risk

**Schema Delivery Method:** Unknown (No schema detected)
Since no structured data was detected in the initial HTML response, any future implementation should prioritize server-side rendering of JSON-LD. If JSON-LD is injected via JavaScript after the initial page load, it risks delayed processing by Google and may be entirely missed by AI crawlers (like GPTBot, ClaudeBot) that do not execute JavaScript.

### Recommended JSON-LD Templates

#### Organization — Primary Entity Identity

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[REPLACE: Your Company Name, e.g., JusorTrans]",
  "url": "https://jusortrans.com",
  "logo": "[REPLACE: URL to your company logo, e.g., https://jusortrans.com/images/logo.png]",
  "description": "[REPLACE: A brief description of your company, e.g., JusorTrans provides professional translation services for various industries and languages.]",
  "sameAs": [
    "[REPLACE: URL to your LinkedIn company page]",
    "[REPLACE: URL to your Twitter/X profile]",
    "[REPLACE: URL to your Facebook page (if applicable)]",
    "[REPLACE: URL to your YouTube channel (if applicable)]",
    "[REPLACE: URL to your Wikipedia page (if available)]",
    "[REPLACE: URL to your Wikidata entity (if available)]"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "[REPLACE: Your primary contact phone number, e.g., +1-555-123-4567]",
    "contactType": "customer service",
    "email": "[REPLACE: Your primary contact email, e.g., info@jusortrans.com]"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[REPLACE: Your street address]",
    "addressLocality": "[REPLACE: Your city]",
    "addressRegion": "[REPLACE: Your state/region (if applicable)]",
    "postalCode": "[REPLACE: Your postal code]",
    "addressCountry": "[REPLACE: Your country (e.g., US)]"
  }
}
```

**Implementation:** Add this JSON-LD to `<head>` inside a `<script type="application/ld+json">` tag.

#### Article / Service — Content Identity for "Professional Translation Services"

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://jusortrans.com"
  },
  "headline": "Professional Translation Services",
  "image": [
    "[REPLACE: URL to a relevant image for this page, e.g., https://jusortrans.com/images/translation-services.jpg]"
  ],
  "datePublished": "[REPLACE: Publication date in ISO 8601 format, e.g., 2023-10-27T09:00:00+00:00]",
  "dateModified": "[REPLACE: Last modified date in ISO 8601 format, e.g., 2024-02-18T14:30:00+00:00]",
  "author": {
    "@type": "Organization",
    "name": "[REPLACE: Your Company Name, e.g., JusorTrans]",
    "url": "https://jusortrans.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "[REPLACE: Your Company Name, e.g., JusorTrans]",
    "url": "https://jusortrans.com",
    "logo": {
      "@type": "ImageObject",
      "url": "[REPLACE: URL to your company logo, e.g., https://jusortrans.com/images/logo.png]"
    }
  },
  "description": "[REPLACE: A concise summary of the page content, e.g., JusorTrans offers high-quality professional translation services across various languages and industries, ensuring accuracy and cultural relevance.]",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [
      "h1",
      ".main-content p"
    ]
  }
}
```

**Implementation:** Add this JSON-LD to `<head>` inside a `<script type="application/ld+json">` tag. Adjust `cssSelector` to target actual speakable content on your page.

#### BreadcrumbList — Navigation Context

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://jusortrans.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Professional Translation Services",
      "item": "https://jusortrans.com"
    }
  ]
}
```

**Implementation:** Add this JSON-LD to `<head>` inside a `<script type="application/ld+json">` tag. Adjust `itemListElement` based on your actual page hierarchy.

#### WebSite + SearchAction — Sitelinks Search Box

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://jusortrans.com",
  "name": "[REPLACE: Your Company Name, e.g., JusorTrans]",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://jusortrans.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

**Implementation:** Add this JSON-LD to `<head>` inside a `<script type="application/ld+json">` tag. Ensure your site has a functional search page at `https://jusortrans.com/search?q=`.

### Priority Actions

1. **[CRITICAL]** Implement the **Organization** schema with comprehensive `sameAs` links to all official social media profiles, LinkedIn, and any other relevant entity pages (e.g., Wikipedia, Crunchbase). This is fundamental for AI entity recognition.
2. **[HIGH]** Implement the **Article** schema for the "Professional Translation Services" page. Populate `headline`, `image`, `datePublished`, `dateModified`, `author` (linking to your Organization), and a descriptive `description`.
3. **[HIGH]** Implement the **BreadcrumbList** schema to provide clear navigation context for search engines.
4. **[MEDIUM]** Implement the **WebSite** schema with `potentialAction` for a sitelinks search box.
5. **[MEDIUM]** Add the `speakable` property to the Article schema, targeting key content sections (e.g., main headings and paragraphs) to enhance AI assistant readability.