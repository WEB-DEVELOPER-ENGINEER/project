#!/usr/bin/env npx tsx
/**
 * Adds the Arabic counterpart of the Golden Visa / immigration article.
 *
 * The `articles/` directory holds 16 English and 15 Arabic .docx sources —
 * this one topic was only ever supplied in English, leaving it as the single
 * blog post with no `translation_group` and therefore no hreflang pair. This
 * script writes the Arabic version and links both rows under the English
 * slug as their shared translation_group, matching the convention used by
 * scripts/link-blog-translations.ts for every other pair.
 *
 * Idempotent: re-running updates the Arabic row in place rather than
 * inserting a duplicate.
 *
 * Usage: npx tsx scripts/seed-article-golden-visa-ar.ts
 */

import { pool } from '../lib/database';
import { extractFaqItems } from '../lib/extract-faq';

/** The English row's slug, used as the shared translation_group key. */
const GROUP =
  'certified-legal-translation-for-immigration-and-golden-visa-procedures-in-dubai-translating-employment-contracts-medical-reports-and-whatsapp-chats-as-admissible-evidence';

const TITLE =
  'الترجمة القانونية المعتمدة لإجراءات الهجرة والإقامة الذهبية في دبي: ترجمة عقود العمل والتقارير الطبية ومحادثات واتساب كأدلة مقبولة';

const SLUG =
  'الترجمة-القانونية-المعتمدة-لإجراءات-الهجرة-والإقامة-الذهبية-في-دبي-ترجمة-عقود-العمل-والتقارير-الطبية-ومحادثات-واتساب-كأدلة-مقبولة';

const CONTENT = `
<p><em>سرّع إجراءات إقامتك، واحمِ أدلتك الرقمية، ووثّق عقود عملك المؤسسية مع <strong>جسور الكلمات للترجمة المعتمدة والقانونية</strong>. نحن شريكك المتخصص في ترجمة ملفات الهجرة والإقامة: ملفات الإقامة الذهبية، وعقود العمل المعتمدة من وزارة الموارد البشرية والتوطين، والتقارير الطبية، وسجلات محادثات واتساب — بدقة فنية والتزام كامل بالمتطلبات التنظيمية في دبي.</em></p>

<p>ترسّخ إمارة دبي مكانتها كمركز عالمي يستقطب المستثمرين الدوليين والخريجين المتميزين وأصحاب المواهب الاستثنائية، مدفوعةً بأنظمة تأشيرات الإقامة المرنة والحديثة التي أطلقتها الهيئة الاتحادية للهوية والجنسية والجمارك وأمن المنافذ (ICP)، وفي مقدمتها نظام الإقامة الذهبية، وتصاريح الإقامة الخضراء، وتأشيرات العمل الحر والعمل عن بُعد. ولتيسير هذه الإجراءات وحماية الاستثمارات طويلة الأجل، وضعت الدولة اشتراطات قانونية وتنظيمية دقيقة تحكم توثيق وترجمة الشهادات الشخصية والمهنية أمام الجهات الاتحادية والمحاكم.</p>

<p>وفي ظل هذا الإطار الرقمي والقانوني المتقدم، فإن التعامل مع <strong>مكتب ترجمة قانونية مرخّص في دبي</strong> ليس خياراً إجرائياً روتينياً، بل شرط أساسي لنجاح ملف التأشيرة وحماية وضعك المهني والعائلي. فترجمة عقود العمل والتقارير الطبية، بل وحتى المراسلات الرقمية مثل محادثات واتساب والبريد الإلكتروني، تتطلب دقة عالية؛ إذ قد يؤدي خطأ بسيط في هذه المستندات إلى رفض التأشيرة، أو تأخير الموافقة على الإقامة، أو بطلان دليل رقمي جوهري أمام اللجان القضائية والخبراء.</p>

<p>في هذا الدليل المتخصص نحلّل الاشتراطات التنظيمية التي تحكم ترجمة مستندات الهجرة والعمل والأدلة الرقمية، ونحدّد المستندات التي تتطلب صياغة ثنائية اللغة على يد مختص، ونناقش التحديات البنيوية في ترجمة الملفات القضائية، ونوضّح لماذا تظل <strong>جسور الكلمات للترجمة المعتمدة والقانونية</strong> الشريك الموثوق للأفراد والشركات متعددة الجنسيات في دبي.</p>

<h2 id="ar-1"><strong>1. الأهمية الاستراتيجية والتنظيمية للترجمة في ملفات الإقامة والإقامة الذهبية</strong></h2>
<p>تخضع طلبات الإقامة وملفات الإقامة الذهبية في دبي لتقييم دقيق من الهيئة الاتحادية للهوية والجنسية والجمارك وأمن المنافذ (ICP) والإدارة العامة للإقامة وشؤون الأجانب (GDRFA)، وتُعدّ الترجمة المعتمدة إلزامية في الحالات التالية:</p>
<ul>
<li><strong>القبول الرسمي للملفات الشخصية والأكاديمية:</strong> تشترط الجهات التنظيمية تقديم كافة المستندات الداعمة — كالشهادات الجامعية، وسندات ملكية العقارات، وكشوف الحسابات البنكية الشخصية، وخطابات التزكية — مصحوبةً بترجمة عربية معتمدة لاستكمال التقييم والحصول على الإقامة الذهبية طويلة الأجل.</li>
<li><strong>إثبات الملاءة المالية ومصادر الدخل:</strong> تتطلب تأشيرات المستثمرين والعمل الحر إثباتاً واضحاً للتدفقات النقدية والوضع المالي، وترجمة السجلات المالية وكشوف الحسابات الأجنبية بدقة أمر جوهري لتسهيل التدقيق الائتماني لدى موظفي الامتثال في إدارات الهجرة.</li>
</ul>

<h2 id="ar-2"><strong>2. ترجمة عقود العمل والاتفاقيات المهنية (وزارة الموارد البشرية والتوطين)</strong></h2>
<p>تمثّل ترجمة عقود العمل واحدة من أدق المهام القانونية والعمالية في ظل قانون العمل الإماراتي (المرسوم بقانون اتحادي رقم 33 لسنة 2021)، وتتطلب هذه المستندات دقة بالغة من أجل:</p>
<ul>
<li><strong>الالتزام بالنماذج المعتمدة لدى وزارة الموارد البشرية والتوطين:</strong> يجب تحرير عقود العمل الموحّدة وعروض التوظيف وتقديمها بصيغة ثنائية اللغة (العربية والإنجليزية) لاستكمال التسجيل الرسمي لتصاريح العمل وتأشيرات الإقامة.</li>
<li><strong>تسوية المنازعات العمالية ودّياً وقضائياً:</strong> في حال نشوء نزاع بشأن مكافأة نهاية الخدمة أو الرواتب المستحقة أو الفصل التعسفي، تشترط المحاكم العمالية تقديم عقود العمل واللوائح الداخلية مترجمةً إلى العربية للتحقق من الحقوق التعاقدية.</li>
</ul>

<h2 id="ar-3"><strong>3. الترجمة المعتمدة للتقارير الطبية والملفات العلاجية</strong></h2>
<p>تشترط الجهات الصحية المحلية — كهيئة الصحة بدبي (DHA) ووزارة الصحة ووقاية المجتمع (MOHAP) — أن تُترجم السجلات الطبية والملفات التشخيصية وفق ضوابط الترجمة المعتمدة، وذلك من أجل:</p>
<ul>
<li><strong>فحوصات اللياقة الطبية لتأشيرات الإقامة:</strong> عند تقديم ملف الإقامة، تطلب إدارات الهجرة ترجمة التاريخ المرضي المرفق وملفات التطعيمات ونتائج الفحوصات الصادرة خارج الدولة للتحقق من الحالة الصحية.</li>
<li><strong>مطالبات التأمين ودعاوى الأخطاء الطبية:</strong> لمعالجة المطالبات الطبية لدى شبكات التأمين المحلية، أو لتقديم السجلات التشخيصية أمام المحاكم في دعاوى الأخطاء الطبية والتعويض، فإن الترجمة المعتمدة للملف الطبي متطلب قانوني.</li>
</ul>

<h2 id="ar-4"><strong>4. الخصوصية القانونية لترجمة محادثات واتساب والبريد الإلكتروني كأدلة رقمية مقبولة</strong></h2>
<p>بموجب قانون الإثبات في المعاملات المدنية والتجارية في دولة الإمارات، تقبل المحاكم المحلية الأدلة الرقمية والإلكترونية — بما فيها سجلات محادثات واتساب ورسائل البريد الإلكتروني والتوقيعات الإلكترونية — كوسيلة إثبات صحيحة لإثبات الالتزامات التجارية أو الشخصية بين أطراف النزاع.</p>
<p>غير أن القانون يرتّب بطلاناً إجرائياً على أي دليل رقمي بلغة أجنبية ما لم تُستخرج المحادثات والرسائل بالكامل وتُترجم إلى العربية على يد مترجم قانوني مرخّص ومقيّد لدى وزارة العدل. وتتطلب ترجمة محادثات واتساب والبريد الإلكتروني دقة مطلقة للحفاظ على الصياغة والتسلسل الزمني وما اتفق عليه الطرفان، دون أي تصرّف لغوي قد يؤثر في تكوين قناعة القاضي بشأن النزاع.</p>

<p><strong>لماذا تختار "جسور الكلمات" شريكاً موثوقاً للترجمة في دبي؟</strong></p>
<p>تحظى <strong>جسور الكلمات للترجمة المعتمدة والقانونية</strong> بثقة كبرى مكاتب المحاماة والمستثمرين الدوليين والعائلات في دبي، لأسباب مهنية واضحة:</p>
<ul>
<li><strong>اعتماد رسمي لدى الوزارات وجهات الهجرة:</strong> بصفتنا <strong>مكتب ترجمة قانونية مرخّصاً في دبي</strong> ومقيّداً لدى وزارة العدل، فإن ترجماتنا المعتمدة مقبولة لدى الهيئة الاتحادية للهوية والجنسية، ووزارة الموارد البشرية والتوطين، والمحاكم المحلية، والوزارات الاتحادية.</li>
<li><strong>سرية تامة وأمن للمعلومات:</strong> ندرك أن سجلات محادثات واتساب والملفات الطبية وعقود العمل تتضمن بيانات شخصية وتجارية بالغة الحساسية، لذا نطبّق ضوابط صارمة لأمن البيانات ونوقّع اتفاقيات عدم إفشاء شاملة مع عملائنا.</li>
<li><strong>رقابة جودة متعددة المراحل وفق ISO:</strong> تمرّ كل شهادة وعقد وتقرير طبي بثلاث مراحل مستقلة من التحرير والتدقيق الفني ومراجعة الجودة لضمان الالتزام الكامل بمعايير ISO.</li>
</ul>

<h2 id="ar-contact"><strong>تواصل مع "جسور الكلمات" لبدء مشروعك اليوم</strong></h2>
<p>احرص على أن تُترجم طلبات الإقامة الذهبية، وعقود العمل المعتمدة لدى وزارة الموارد البشرية والتوطين، والسجلات الطبية، والأدلة الرقمية من محادثات واتساب، بدقة فنية تامة وسرعة والتزام كامل بالاشتراطات التنظيمية.</p>
<ul>
<li>📞 <strong>الهاتف / واتساب:</strong> ‎+971503244329</li>
<li>📧 <strong>البريد الإلكتروني:</strong> info@jusortrans.com</li>
<li>🌐 <strong>الموقع الإلكتروني:</strong> www.jusortrans.com</li>
<li>📍 <strong>عنوان المكتب:</strong> مركز أبو سيف للأعمال - بناية الكاظم - بلوك A - الطابق الميزانين - مكتب 40B - أبو هيل - دبي، الإمارات العربية المتحدة.</li>
</ul>

<h2 id="ar-faq"><strong>الأسئلة الشائعة</strong></h2>
<p><strong>1. ما المستندات التي تتطلب ترجمة معتمدة لطلب الإقامة الذهبية في دبي؟</strong></p>
<p>تشترط الهيئة الاتحادية للهوية والجنسية والجمارك وأمن المنافذ (ICP) تقديم سندات ملكية العقارات، والشهادات الجامعية، وكشوف الدرجات الأكاديمية، وكشوف الحسابات البنكية الأجنبية، وخطابات التزكية المهنية، مصحوبةً بترجمة عربية معتمدة لتقييم طلب التأشيرة.</p>
<p><strong>2. هل تقبل محاكم دبي محادثات واتساب دون ترجمة؟</strong></p>
<p>لا. لا تعتدّ محاكم دبي والنيابة العامة بأي محادثات واتساب أو رسائل بريد إلكتروني محرّرة بلغة أجنبية ما لم تُستخرج بالكامل وتُترجم إلى العربية على يد مترجم قانوني مرخّص من وزارة العدل، بما يضفي عليها صفة الدليل الرقمي المقبول أمام القاضي.</p>
<p><strong>3. هل تُقبل ترجماتكم للتقارير الطبية لدى شركات التأمين والمحاكم؟</strong></p>
<p>نعم. بصفتنا مكتب ترجمة قانونية مرخّصاً ومقيّداً لدى وزارة العدل، تُقبل ترجماتنا لكافة التقارير الطبية والملفات التشخيصية وفواتير العلاج رسمياً لدى شركات التأمين، وهيئة الصحة بدبي، ووزارة الصحة ووقاية المجتمع، والمحاكم المحلية، لتسوية المطالبات التأمينية والتعويضات.</p>
`.trim();

const EXCERPT =
  'ترسّخ إمارة دبي مكانتها كمركز عالمي يستقطب المستثمرين الدوليين وأصحاب المواهب، مدفوعةً بأنظمة الإقامة المرنة التي أطلقتها الهيئة الاتحادية للهوية والجنسية، وفي مقدمتها الإقامة الذهبية.';

const META_DESCRIPTION =
  'دليل متخصص في الترجمة المعتمدة لملفات الإقامة الذهبية وعقود العمل والتقارير الطبية ومحادثات واتساب كأدلة رقمية مقبولة أمام محاكم دبي.';

const TAGS = [
  'Legal Translation',
  'Certified Translation',
  'Dubai',
  'MOHRE',
  'UAE',
  'Court Documents',
  'Contracts',
  'Compliance',
];

const TOC = [
  { id: 'ar-1', text: '١. الأهمية الاستراتيجية والتنظيمية للترجمة في ملفات الإقامة والإقامة الذهبية', level: 2 },
  { id: 'ar-2', text: '٢. ترجمة عقود العمل والاتفاقيات المهنية (وزارة الموارد البشرية والتوطين)', level: 2 },
  { id: 'ar-3', text: '٣. الترجمة المعتمدة للتقارير الطبية والملفات العلاجية', level: 2 },
  { id: 'ar-4', text: '٤. الخصوصية القانونية لترجمة محادثات واتساب والبريد الإلكتروني كأدلة رقمية', level: 2 },
  { id: 'ar-contact', text: 'تواصل مع "جسور الكلمات" لبدء مشروعك اليوم', level: 2 },
  { id: 'ar-faq', text: 'الأسئلة الشائعة', level: 2 },
];

/** Arabic averages ~180 words/minute in reading-speed research. */
function readingTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 180));
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const englishRow = await client.query(
      `SELECT id, published_date, author, image_url FROM blog_posts WHERE slug = $1`,
      [GROUP]
    );
    if (englishRow.rows.length === 0) {
      throw new Error(`English source row not found for slug "${GROUP}"`);
    }
    const en = englishRow.rows[0];

    const faqItems = extractFaqItems(CONTENT);
    const schemaMarkup = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: TITLE,
      description: META_DESCRIPTION,
      inLanguage: 'ar',
      author: { '@type': 'Organization', name: 'جسور الكلمات لخدمات الترجمة' },
      publisher: { '@type': 'Organization', name: 'جسور الكلمات لخدمات الترجمة' },
      ...(faqItems.length
        ? {
            mainEntity: faqItems.map((f: { question: string; answer: string }) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }
        : {}),
    };

    await client.query(
      `INSERT INTO blog_posts (
         title, slug, description, excerpt, content, author, meta_title, meta_description,
         published_date, is_published, featured, reading_time, tags,
         table_of_contents, schema_markup, image_url, locale, translation_group
       ) VALUES ($1,$2,$3,$3,$4,$5,$6,$7,$8,true,false,$9,$10,$11,$12,$13,'ar',$14)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         excerpt = EXCLUDED.excerpt,
         content = EXCLUDED.content,
         meta_title = EXCLUDED.meta_title,
         meta_description = EXCLUDED.meta_description,
         reading_time = EXCLUDED.reading_time,
         tags = EXCLUDED.tags,
         table_of_contents = EXCLUDED.table_of_contents,
         schema_markup = EXCLUDED.schema_markup,
         locale = EXCLUDED.locale,
         translation_group = EXCLUDED.translation_group,
         updated_at = CURRENT_TIMESTAMP`,
      [
        TITLE,
        SLUG,
        EXCERPT,
        CONTENT,
        en.author || 'JUSOR Team',
        TITLE,
        META_DESCRIPTION,
        en.published_date,
        readingTime(CONTENT),
        TAGS,
        JSON.stringify(TOC),
        JSON.stringify(schemaMarkup),
        en.image_url,
        GROUP,
      ]
    );

    // Link the English side into the same group so hreflang resolves both ways.
    await client.query(
      `UPDATE blog_posts SET translation_group = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [GROUP, en.id]
    );

    await client.query('COMMIT');
    console.log(`✅ Arabic article seeded and linked to group "${GROUP.slice(0, 50)}…"`);
    console.log(`   FAQ items: ${faqItems.length}, reading time: ${readingTime(CONTENT)} min`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
