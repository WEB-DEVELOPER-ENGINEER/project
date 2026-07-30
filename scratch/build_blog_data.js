const fs = require('fs');
const path = require('path');

const articlesJsonPath = path.join(__dirname, 'extracted_articles.json');
const articles = JSON.parse(fs.readFileSync(articlesJsonPath, 'utf8'));

const englishArticles = [];
const arabicArticles = [];

articles.forEach(article => {
  const blogItem = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    description: article.description,
    content: article.content,
    published_date: article.published_date,
    author: article.author,
    image_url: null,
    is_published: true
  };

  if (article.isArabic) {
    arabicArticles.push(blogItem);
  } else {
    englishArticles.push(blogItem);
  }
});

console.log(`English Articles: ${englishArticles.length}`);
console.log(`Arabic Articles: ${arabicArticles.length}`);

const codeContent = `// Automatically generated blog database containing all 31 custom articles
export interface BlogArticle {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  published_date: string;
  author: string;
  image_url?: string | null;
  is_published: boolean;
}

export const englishArticles: BlogArticle[] = ${JSON.stringify(englishArticles, null, 2)};

export const arabicArticles: BlogArticle[] = ${JSON.stringify(arabicArticles, null, 2)};

export function getAllArticles(isArabic: boolean = false): BlogArticle[] {
  return isArabic ? arabicArticles : englishArticles;
}

export function getArticleBySlug(slug: string, isArabic: boolean = false): BlogArticle | undefined {
  const list = isArabic ? arabicArticles : englishArticles;
  return list.find(a => a.slug === slug) || list.find(a => decodeURIComponent(slug).includes(a.slug) || a.slug.includes(slug));
}
`;

fs.writeFileSync(
  path.join(__dirname, '../lib/blog-data.ts'),
  codeContent,
  'utf8'
);

console.log('Successfully created lib/blog-data.ts!');
