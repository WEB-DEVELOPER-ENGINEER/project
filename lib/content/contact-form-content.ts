/**
 * Contact / quote-request form copy, in English and Arabic.
 *
 * Covers field labels, placeholders, validation messages, toast text, and
 * the select-option lists (service types, languages, document types).
 *
 * The option VALUES submitted to the API stay in English so that
 * submissions land in the database in one consistent language regardless of
 * which locale the visitor used — only the displayed labels are localised.
 * See `serviceTypes` / `languages` / `documentTypes` below, which pair a
 * stable `value` with a per-locale `label`.
 */

import type { Locale } from '@/lib/locale';

export interface Option {
  value: string;
  label: string;
}

export interface ContactFormContent {
  heading: string;
  subheading: string;
  cardTitle: string;
  cardDescription: string;

  // Field labels
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  fromLanguage: string;
  toLanguage: string;
  documentType: string;
  wordCount: string;
  deadline: string;
  certificationNeeded: string;
  subject: string;
  projectDetails: string;
  attachments: string;

  // Placeholders
  phName: string;
  phEmail: string;
  phPhone: string;
  phService: string;
  phSourceLang: string;
  phTargetLang: string;
  phDocType: string;
  phWordCount: string;
  phSubject: string;
  phMessage: string;

  // Helper / misc
  messageHelp: string;
  clickToUpload: string;
  orDragDrop: string;
  fileHint: string;
  privacyLabel: string;
  privacyBody: string;
  submit: string;
  submitting: string;
  submitHelp: string;
  removeFile: string;

  // Validation
  vNameRequired: string;
  vNameShort: string;
  vEmailRequired: string;
  vEmailInvalid: string;
  vMessageRequired: string;
  vMessageShort: string;
  vPhoneInvalid: string;
  vNumberInvalid: string;
  vDeadlinePast: string;

  // Toasts
  tValidationTitle: string;
  tValidationBody: string;
  tSuccessTitle: string;
  tSuccessBody: string;
  tErrorTitle: string;
  tErrorBody: string;
  tFileTitle: string;
  tFileBody: string;

  // Success panel
  successTitle: string;
  successBody: string;
  successAgain: string;

  // Sidebar
  quickResponseTitle: string;
  quickResponseBody: string;
  quoteGuarantee: string;
  includeTitle: string;
  includeItems: string[];
  urgentTitle: string;
  urgentBody: string;
  urgentWhatsapp: string;
  urgentWhatsappMessage: string;

  serviceTypes: Option[];
  languages: Option[];
  documentTypes: Option[];
}

const SERVICE_VALUES = [
  'Document Translation',
  'Website Translation',
  'Legal Translation',
  'Medical Translation',
  'Technical Translation',
  'Certified Translation',
  'Interpretation Services',
  'Localization Services',
  'Proofreading & Editing',
  'Urgent Translation',
  'Other Services',
];

const SERVICE_LABELS_AR = [
  'ترجمة المستندات',
  'ترجمة المواقع الإلكترونية',
  'الترجمة القانونية',
  'الترجمة الطبية',
  'الترجمة التقنية',
  'الترجمة المعتمدة',
  'الترجمة الفورية',
  'خدمات التوطين',
  'التدقيق والمراجعة اللغوية',
  'ترجمة عاجلة',
  'خدمات أخرى',
];

const LANGUAGE_VALUES = [
  'Arabic', 'English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese',
  'Russian', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Japanese',
  'Korean', 'Hindi', 'Urdu', 'Persian/Farsi', 'Turkish', 'Dutch', 'Swedish',
  'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian', 'Romanian',
  'Bulgarian', 'Greek', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian', 'Malay',
  'Other',
];

const LANGUAGE_LABELS_AR = [
  'العربية', 'الإنجليزية', 'الفرنسية', 'الألمانية', 'الإسبانية', 'الإيطالية', 'البرتغالية',
  'الروسية', 'الصينية (المبسطة)', 'الصينية (التقليدية)', 'اليابانية',
  'الكورية', 'الهندية', 'الأردية', 'الفارسية', 'التركية', 'الهولندية', 'السويدية',
  'النرويجية', 'الدنماركية', 'الفنلندية', 'البولندية', 'التشيكية', 'المجرية', 'الرومانية',
  'البلغارية', 'اليونانية', 'العبرية', 'التايلاندية', 'الفيتنامية', 'الإندونيسية', 'الماليزية',
  'أخرى',
];

const DOCTYPE_VALUES = [
  'Legal Documents', 'Medical Records', 'Technical Manuals', 'Academic Papers',
  'Business Documents', 'Marketing Materials', 'Website Content', 'Patents',
  'Certificates', 'Personal Documents', 'Financial Reports', 'Other',
];

const DOCTYPE_LABELS_AR = [
  'مستندات قانونية', 'سجلات طبية', 'أدلة تقنية', 'أوراق أكاديمية',
  'مستندات تجارية', 'مواد تسويقية', 'محتوى موقع إلكتروني', 'براءات اختراع',
  'شهادات', 'مستندات شخصية', 'تقارير مالية', 'أخرى',
];

const pair = (values: string[], labels: string[], locale: Locale): Option[] =>
  values.map((value, i) => ({ value, label: locale === 'ar' ? labels[i] : value }));

export const CONTACT_FORM_CONTENT: Record<Locale, ContactFormContent> = {
  en: {
    heading: 'Send Us a Message',
    subheading:
      "Fill out the form below and we'll get back to you with a quote for your translation project.",
    cardTitle: 'Get Your Free Quote',
    cardDescription:
      "Tell us about your project and we'll provide a detailed quote.",
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    serviceType: 'Service Type',
    fromLanguage: 'From Language',
    toLanguage: 'To Language',
    documentType: 'Document Type',
    wordCount: 'Estimated Word Count',
    deadline: 'Preferred Deadline',
    certificationNeeded: 'Certified translation required',
    subject: 'Subject',
    projectDetails: 'Project Details',
    attachments: 'Attach Documents (Optional)',
    phName: 'Enter your full name',
    phEmail: 'Enter your email address',
    phPhone: 'Enter your phone number',
    phService: 'Select a service',
    phSourceLang: 'Select source language',
    phTargetLang: 'Select target language',
    phDocType: 'Select document type',
    phWordCount: 'e.g., 1000',
    phSubject: 'Brief description of your project',
    phMessage:
      'Please describe your translation project in detail. Include any special requirements, formatting needs, or specific terminology.',
    messageHelp: 'Provide as much detail as possible for an accurate quote',
    clickToUpload: 'Click to upload',
    orDragDrop: 'or drag and drop',
    fileHint: 'PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB each, up to 5 files)',
    privacyLabel: 'Privacy Notice:',
    privacyBody:
      'Your information is secure and will only be used to provide you with translation services. We never share your data with third parties.',
    submit: 'Get Free Quote',
    submitting: 'Sending Message...',
    submitHelp: "We'll respond during business hours",
    removeFile: 'Remove',
    vNameRequired: 'Name is required',
    vNameShort: 'Name must be at least 2 characters',
    vEmailRequired: 'Email is required',
    vEmailInvalid: 'Please enter a valid email address',
    vMessageRequired: 'Message is required',
    vMessageShort: 'Message must be at least 10 characters',
    vPhoneInvalid: 'Please enter a valid phone number',
    vNumberInvalid: 'Please enter a valid number',
    vDeadlinePast: 'Deadline must be in the future',
    tValidationTitle: 'Validation Error',
    tValidationBody: 'Please fix the errors in the form and try again.',
    tSuccessTitle: 'Message Sent Successfully!',
    tSuccessBody: "Thank you for contacting us. We'll get back to you shortly.",
    tErrorTitle: 'Error Sending Message',
    tErrorBody:
      'There was a problem sending your message. Please try again or contact us directly.',
    tFileTitle: 'File Upload Warning',
    tFileBody:
      'Some files were skipped. Only PDF, DOC, DOCX, TXT, JPG, and PNG files under 10MB are allowed.',
    successTitle: 'Message Sent Successfully!',
    successBody:
      "Thank you for contacting us. We've received your message and will get back to you shortly.",
    successAgain: 'Send Another Message',
    quickResponseTitle: 'Quick Response',
    quickResponseBody:
      'We aim to respond to all enquiries during business hours.',
    quoteGuarantee: 'Free, no-obligation quote',
    includeTitle: 'For Accurate Quotes, Include:',
    includeItems: [
      'Source and target languages',
      'Document type and word count',
      'Deadline requirements',
      'Certification needs',
      'Special formatting requirements',
    ],
    urgentTitle: 'Urgent Projects?',
    urgentBody: 'For urgent translation needs, contact us directly:',
    urgentWhatsapp: 'WhatsApp Chat',
    urgentWhatsappMessage: 'I have an urgent translation project.',
    serviceTypes: pair(SERVICE_VALUES, SERVICE_LABELS_AR, 'en'),
    languages: pair(LANGUAGE_VALUES, LANGUAGE_LABELS_AR, 'en'),
    documentTypes: pair(DOCTYPE_VALUES, DOCTYPE_LABELS_AR, 'en'),
  },

  ar: {
    heading: 'أرسل لنا رسالة',
    subheading: 'املأ النموذج أدناه وسنوافيك بعرض سعر لمشروع الترجمة الخاص بك.',
    cardTitle: 'احصل على عرض سعر مجاني',
    cardDescription: 'أخبرنا عن مشروعك وسنقدّم لك عرض سعر مفصّلاً.',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    serviceType: 'نوع الخدمة',
    fromLanguage: 'من لغة',
    toLanguage: 'إلى لغة',
    documentType: 'نوع المستند',
    wordCount: 'عدد الكلمات التقريبي',
    deadline: 'الموعد النهائي المفضّل',
    certificationNeeded: 'أحتاج إلى ترجمة معتمدة',
    subject: 'الموضوع',
    projectDetails: 'تفاصيل المشروع',
    attachments: 'إرفاق المستندات (اختياري)',
    phName: 'أدخل اسمك الكامل',
    phEmail: 'أدخل بريدك الإلكتروني',
    phPhone: 'أدخل رقم هاتفك',
    phService: 'اختر خدمة',
    phSourceLang: 'اختر اللغة المصدر',
    phTargetLang: 'اختر اللغة الهدف',
    phDocType: 'اختر نوع المستند',
    phWordCount: 'مثال: 1000',
    phSubject: 'وصف موجز لمشروعك',
    phMessage:
      'يرجى وصف مشروع الترجمة بالتفصيل، مع ذكر أي متطلبات خاصة أو احتياجات تنسيق أو مصطلحات محددة.',
    messageHelp: 'قدّم أكبر قدر من التفاصيل للحصول على عرض سعر دقيق',
    clickToUpload: 'انقر للرفع',
    orDragDrop: 'أو اسحب الملف وأفلته',
    fileHint: 'PDF أو DOC أو DOCX أو TXT أو JPG أو PNG (بحد أقصى 10 ميجابايت لكل ملف، وحتى 5 ملفات)',
    privacyLabel: 'إشعار الخصوصية:',
    privacyBody:
      'معلوماتك آمنة ولن تُستخدم إلا لتقديم خدمات الترجمة لك. ولا نشارك بياناتك مع أي طرف ثالث.',
    submit: 'احصل على عرض سعر مجاني',
    submitting: 'جارٍ الإرسال...',
    submitHelp: 'سنردّ عليك خلال ساعات العمل',
    removeFile: 'إزالة',
    vNameRequired: 'الاسم مطلوب',
    vNameShort: 'يجب ألا يقل الاسم عن حرفين',
    vEmailRequired: 'البريد الإلكتروني مطلوب',
    vEmailInvalid: 'يرجى إدخال بريد إلكتروني صحيح',
    vMessageRequired: 'الرسالة مطلوبة',
    vMessageShort: 'يجب ألا تقل الرسالة عن 10 أحرف',
    vPhoneInvalid: 'يرجى إدخال رقم هاتف صحيح',
    vNumberInvalid: 'يرجى إدخال رقم صحيح',
    vDeadlinePast: 'يجب أن يكون الموعد النهائي في المستقبل',
    tValidationTitle: 'خطأ في التحقق',
    tValidationBody: 'يرجى تصحيح الأخطاء في النموذج والمحاولة مرة أخرى.',
    tSuccessTitle: 'تم إرسال الرسالة بنجاح!',
    tSuccessBody: 'شكراً لتواصلك معنا. سنعاود الاتصال بك قريباً.',
    tErrorTitle: 'تعذّر إرسال الرسالة',
    tErrorBody: 'حدثت مشكلة أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.',
    tFileTitle: 'تنبيه بشأن رفع الملفات',
    tFileBody:
      'تم تخطي بعض الملفات. يُسمح فقط بملفات PDF وDOC وDOCX وTXT وJPG وPNG بحجم أقل من 10 ميجابايت.',
    successTitle: 'تم إرسال الرسالة بنجاح!',
    successBody: 'شكراً لتواصلك معنا. لقد استلمنا رسالتك وسنعاود الاتصال بك قريباً.',
    successAgain: 'إرسال رسالة أخرى',
    quickResponseTitle: 'استجابة سريعة',
    quickResponseBody: 'نحرص على الرد على جميع الاستفسارات خلال ساعات العمل.',
    quoteGuarantee: 'عرض سعر مجاني وبدون التزام',
    includeTitle: 'للحصول على عرض سعر دقيق، أرفق:',
    includeItems: [
      'اللغة المصدر واللغة الهدف',
      'نوع المستند وعدد الكلمات',
      'الموعد النهائي المطلوب',
      'الحاجة إلى اعتماد الترجمة',
      'أي متطلبات تنسيق خاصة',
    ],
    urgentTitle: 'مشاريع عاجلة؟',
    urgentBody: 'للاحتياجات العاجلة، تواصل معنا مباشرة:',
    urgentWhatsapp: 'محادثة واتساب',
    urgentWhatsappMessage: 'لديّ مشروع ترجمة عاجل.',
    serviceTypes: pair(SERVICE_VALUES, SERVICE_LABELS_AR, 'ar'),
    languages: pair(LANGUAGE_VALUES, LANGUAGE_LABELS_AR, 'ar'),
    documentTypes: pair(DOCTYPE_VALUES, DOCTYPE_LABELS_AR, 'ar'),
  },
};
