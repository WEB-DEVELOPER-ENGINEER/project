/**
 * Privacy policy copy, in English and Arabic.
 *
 * Rewritten to reflect what a certified translation office actually does
 * with client data — the documents clients submit for translation are the
 * genuinely sensitive asset here (court filings, medical reports, bank
 * statements), not "accounts" or "transactions". The previous version was
 * generic SaaS boilerplate that described things this business doesn't do.
 *
 * NOTE: this is plain-language policy copy, not legal advice. It should be
 * reviewed by a qualified UAE legal advisor before it is relied on as the
 * company's binding privacy policy.
 */

import type { Locale } from '@/lib/locale';

/**
 * Rendered strictly in this order:
 *   paragraphs → subheading → items → extraSubheading → extraItems
 * `extraItemsAsProse` renders `extraItems` as paragraphs instead of a list.
 */
export interface PrivacySection {
  id: string;
  heading: string;
  paragraphs?: string[];
  subheading?: string;
  items?: string[];
  extraSubheading?: string;
  extraItems?: string[];
  extraItemsAsProse?: boolean;
}

export interface PrivacyContent {
  title: string;
  lastUpdatedLabel: string;
  intro: string;
  sections: PrivacySection[];
  contactHeading: string;
  contactIntro: string;
  labels: { company: string; email: string; address: string };
}

/**
 * Fixed revision date for the policy. Deliberately a constant rather than
 * `new Date()` — a legal document must state when it was actually last
 * revised; rendering "today" would falsely imply daily updates. Bump this
 * whenever the policy text below genuinely changes.
 */
export const PRIVACY_LAST_UPDATED = '2026-07-30';

export const PRIVACY_CONTENT: Record<Locale, PrivacyContent> = {
  en: {
    title: 'Privacy Policy',
    lastUpdatedLabel: 'Last updated',
    intro:
      'This policy explains what information we collect when you request translation services from us, how we handle the documents you send us, and the choices you have over your data.',
    sections: [
      {
        id: 'information-collection',
        heading: 'Information We Collect',
        paragraphs: ['We collect information you provide directly to us, such as when you:'],
        items: [
          'Request a quote or contact us about a translation project',
          'Send us documents to be translated, reviewed, or certified',
          'Provide contact and billing details so we can deliver your order',
          'Subscribe to our newsletter or respond to a survey',
        ],
        extraSubheading: 'Documents you send us',
        extraItemsAsProse: true,
        extraItems: [
          'Documents submitted for translation frequently contain personal, legal, medical, or financial information — court filings, medical reports, bank statements, contracts, and civil status records.',
          'We treat these documents as confidential and use them only to prepare, review, certify, and deliver the translation you requested.',
        ],
      },
      {
        id: 'information-use',
        heading: 'How We Use Your Information',
        paragraphs: ['We use the information we collect to:'],
        items: [
          'Prepare, review, certify, and deliver your translations',
          'Provide quotes and respond to your enquiries',
          'Issue invoices and maintain the records our accreditations require',
          'Notify you about the status of your order',
          'Improve the quality and accuracy of our services',
        ],
      },
      {
        id: 'confidentiality',
        heading: 'Confidentiality of Your Documents',
        paragraphs: [
          'Access to your documents is limited to the translator and reviewer assigned to your project, and to staff who need it to deliver your order.',
          'Our translators and reviewers are bound by non-disclosure agreements. We do not use your documents for any purpose other than the service you requested, and we do not disclose their contents to third parties except where you have asked us to, or where we are legally required to do so.',
        ],
      },
      {
        id: 'data-retention',
        heading: 'How Long We Keep Your Documents',
        paragraphs: [
          'We retain source documents and completed translations only as long as needed to deliver your order, handle any follow-up or re-issue request, and meet the record-keeping obligations that apply to a licensed and accredited translation office in the UAE.',
          'You may ask us to delete your documents once your order is complete, and we will do so except where we are legally required to keep a copy.',
        ],
      },
      {
        id: 'cookies',
        heading: 'Cookies and Tracking Technologies',
        paragraphs: [
          'We use cookies and similar technologies to keep this website working and to understand how it is used. You can control these through our cookie consent manager or your browser settings.',
        ],
        subheading: 'Types of cookies we use:',
        items: [
          'Necessary cookies: required for the website to function',
          'Analytics cookies: help us understand how the site is used',
          'Marketing cookies: used to measure and target our advertising',
          'Preference cookies: remember your settings, such as your language',
        ],
      },
      {
        id: 'data-sharing',
        heading: 'Information Sharing and Disclosure',
        paragraphs: ['We may share your information in the following circumstances:'],
        items: [
          'With your consent — for example, when you ask us to submit a translation to a government entity on your behalf',
          'To comply with a legal obligation, court order, or request from a competent authority',
          'With service providers who help us operate, and who are bound to protect your information',
          'To establish, exercise, or defend legal claims, or to protect rights and safety',
        ],
      },
      {
        id: 'your-rights',
        heading: 'Your Rights and Choices',
        paragraphs: [
          'Depending on where you are located, you may have the following rights over your personal information. To exercise any of them, contact us using the details below.',
        ],
        subheading: 'GDPR rights (EU/UK):',
        items: [
          'Right to access your personal data',
          'Right to correct inaccurate data',
          'Right to erasure ("right to be forgotten")',
          'Right to restrict processing',
          'Right to data portability',
          'Right to object to processing',
        ],
        extraSubheading: 'CCPA rights (California):',
        extraItems: [
          'Right to know what personal information is collected',
          'Right to request deletion of personal information',
          'Right to opt out of the sale of personal information',
          'Right not to be discriminated against for exercising your privacy rights',
        ],
      },
      {
        id: 'data-security',
        heading: 'Data Security',
        paragraphs: [
          'We apply appropriate technical and organisational measures — including access controls and secure file transfer — to protect your information against unauthorised access, alteration, disclosure, or destruction.',
        ],
      },
      {
        id: 'international-transfers',
        heading: 'International Data Transfers',
        paragraphs: [
          'Where a project requires it, your information may be processed outside your country of residence. Where that happens, we take steps to ensure it remains protected to the standard described in this policy.',
        ],
      },
    ],
    contactHeading: 'Contact Us',
    contactIntro:
      'If you have any questions about this policy, or wish to exercise any of your rights, please contact us:',
    labels: { company: 'Company', email: 'Email', address: 'Address' },
  },

  ar: {
    title: 'سياسة الخصوصية',
    lastUpdatedLabel: 'آخر تحديث',
    intro:
      'توضح هذه السياسة المعلومات التي نجمعها عند طلب خدمات الترجمة منّا، وكيفية تعاملنا مع المستندات التي ترسلها إلينا، والخيارات المتاحة لك بشأن بياناتك.',
    sections: [
      {
        id: 'information-collection',
        heading: 'المعلومات التي نجمعها',
        paragraphs: ['نجمع المعلومات التي تقدّمها إلينا مباشرة، ومن ذلك عندما:'],
        items: [
          'تطلب عرض سعر أو تتواصل معنا بشأن مشروع ترجمة',
          'ترسل إلينا مستندات لترجمتها أو مراجعتها أو اعتمادها',
          'تزوّدنا ببيانات التواصل والفوترة لتسليم طلبك',
          'تشترك في نشرتنا البريدية أو تشارك في استبيان',
        ],
        extraSubheading: 'المستندات التي ترسلها إلينا',
        extraItemsAsProse: true,
        extraItems: [
          'كثيراً ما تتضمن المستندات المقدَّمة للترجمة معلومات شخصية أو قانونية أو طبية أو مالية — كصحف الدعاوى والتقارير الطبية وكشوف الحسابات البنكية والعقود ووثائق الأحوال المدنية.',
          'نتعامل مع هذه المستندات بسرية تامة ولا نستخدمها إلا لإعداد الترجمة المطلوبة ومراجعتها واعتمادها وتسليمها.',
        ],
      },
      {
        id: 'information-use',
        heading: 'كيف نستخدم معلوماتك',
        paragraphs: ['نستخدم المعلومات التي نجمعها من أجل:'],
        items: [
          'إعداد ترجماتك ومراجعتها واعتمادها وتسليمها',
          'تقديم عروض الأسعار والرد على استفساراتك',
          'إصدار الفواتير والاحتفاظ بالسجلات التي تقتضيها اعتماداتنا',
          'إشعارك بحالة طلبك',
          'تحسين جودة خدماتنا ودقتها',
        ],
      },
      {
        id: 'confidentiality',
        heading: 'سرية مستنداتك',
        paragraphs: [
          'يقتصر الاطلاع على مستنداتك على المترجم والمراجع المكلّفَين بمشروعك، وعلى الموظفين الذين يحتاجون إليها لتسليم طلبك.',
          'يلتزم مترجمونا ومراجعونا باتفاقيات عدم إفشاء. ولا نستخدم مستنداتك لأي غرض غير الخدمة التي طلبتها، ولا نفصح عن محتواها لأي طرف ثالث إلا بناءً على طلبك أو عندما يُلزمنا القانون بذلك.',
        ],
      },
      {
        id: 'data-retention',
        heading: 'مدة الاحتفاظ بمستنداتك',
        paragraphs: [
          'نحتفظ بالمستندات الأصلية والترجمات المنجزة للمدة اللازمة فقط لتسليم طلبك، ومعالجة أي طلب لاحق أو إعادة إصدار، والوفاء بالتزامات حفظ السجلات المطبّقة على مكتب ترجمة مرخّص ومعتمد في دولة الإمارات.',
          'يمكنك أن تطلب منّا حذف مستنداتك بعد اكتمال طلبك، وسنستجيب لذلك ما لم نكن ملزمين قانوناً بالاحتفاظ بنسخة منها.',
        ],
      },
      {
        id: 'cookies',
        heading: 'ملفات تعريف الارتباط وتقنيات التتبع',
        paragraphs: [
          'نستخدم ملفات تعريف الارتباط وتقنيات مشابهة لتشغيل هذا الموقع ولفهم طريقة استخدامه. ويمكنك التحكم بها عبر مدير الموافقة لدينا أو من إعدادات متصفحك.',
        ],
        subheading: 'أنواع ملفات تعريف الارتباط التي نستخدمها:',
        items: [
          'ملفات ضرورية: لازمة لعمل الموقع',
          'ملفات تحليلية: تساعدنا على فهم كيفية استخدام الموقع',
          'ملفات تسويقية: تُستخدم لقياس إعلاناتنا وتوجيهها',
          'ملفات التفضيلات: تحفظ إعداداتك، مثل لغتك المختارة',
        ],
      },
      {
        id: 'data-sharing',
        heading: 'مشاركة المعلومات والإفصاح عنها',
        paragraphs: ['قد نشارك معلوماتك في الحالات التالية:'],
        items: [
          'بموافقتك — كأن تطلب منّا تقديم ترجمة إلى جهة حكومية نيابةً عنك',
          'للامتثال لالتزام قانوني أو أمر قضائي أو طلب من جهة مختصة',
          'مع مزوّدي الخدمات الذين يعاوننا في أعمالنا والملتزمين بحماية معلوماتك',
          'لإثبات حق قانوني أو ممارسته أو الدفاع عنه، أو لحماية الحقوق والسلامة',
        ],
      },
      {
        id: 'your-rights',
        heading: 'حقوقك وخياراتك',
        paragraphs: [
          'قد تكون لديك الحقوق التالية بشأن معلوماتك الشخصية، تبعاً لمكان إقامتك. ولممارسة أي منها، تواصل معنا عبر البيانات الواردة أدناه.',
        ],
        subheading: 'الحقوق بموجب اللائحة الأوروبية (GDPR):',
        items: [
          'الحق في الاطلاع على بياناتك الشخصية',
          'الحق في تصحيح البيانات غير الدقيقة',
          'الحق في المحو («الحق في النسيان»)',
          'الحق في تقييد المعالجة',
          'الحق في نقل البيانات',
          'الحق في الاعتراض على المعالجة',
        ],
        extraSubheading: 'الحقوق بموجب قانون كاليفورنيا (CCPA):',
        extraItems: [
          'الحق في معرفة المعلومات الشخصية التي يتم جمعها',
          'الحق في طلب حذف المعلومات الشخصية',
          'الحق في رفض بيع المعلومات الشخصية',
          'الحق في عدم التعرّض للتمييز عند ممارسة حقوق الخصوصية',
        ],
      },
      {
        id: 'data-security',
        heading: 'أمن البيانات',
        paragraphs: [
          'نطبّق تدابير تقنية وتنظيمية مناسبة — تشمل ضوابط الوصول ونقل الملفات بشكل آمن — لحماية معلوماتك من الوصول غير المصرّح به أو التعديل أو الإفصاح أو الإتلاف.',
        ],
      },
      {
        id: 'international-transfers',
        heading: 'نقل البيانات دولياً',
        paragraphs: [
          'قد تُعالَج معلوماتك خارج بلد إقامتك عندما يستلزم المشروع ذلك. وفي هذه الحالة، نتخذ الإجراءات اللازمة لضمان بقائها محمية وفق المستوى الموضّح في هذه السياسة.',
        ],
      },
    ],
    contactHeading: 'تواصل معنا',
    contactIntro:
      'إذا كان لديك أي استفسار بشأن هذه السياسة، أو رغبت في ممارسة أي من حقوقك، يرجى التواصل معنا:',
    labels: { company: 'الشركة', email: 'البريد الإلكتروني', address: 'العنوان' },
  },
};
