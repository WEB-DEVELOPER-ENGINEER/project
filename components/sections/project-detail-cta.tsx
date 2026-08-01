'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle,
  Phone,
  Mail,
  ArrowRight,
  Star,
  Users,
  Award
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Project } from '@/lib/types';
import Link from 'next/link';
import { trackPhoneClick, trackEmailClick, trackWhatsAppClick } from '@/lib/analytics-events';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { localizedPath } from '@/lib/locale';

interface ProjectDetailCTAProps {
  project: Project;
  siteSettings?: Record<string, any>;
}

export function ProjectDetailCTA({ project, siteSettings = {} }: ProjectDetailCTAProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { locale, isRtl } = useLanguage();

  const text = {
    en: {
      title: 'Ready to Start Your Translation Project?',
      desc: 'Get the same professional quality and attention to detail that made this project successful. Our expert team is ready to help you achieve your translation goals.',
      projects: 'Projects Completed',
      clients: 'Happy Clients',
      quality: 'Quality Score',
      card1Title: 'Get Instant Quote',
      card1Desc: 'Contact us directly for immediate assistance and personalized consultation about your translation needs.',
      whatsappLabel: 'WhatsApp',
      phoneLabel: 'Call',
      emailLabel: 'Email',
      cardTitle: 'Request Detailed Quote',
      cardDesc: 'Submit your project details through our contact form for a comprehensive quote and project timeline.',
      getQuote: 'Get Detailed Quote',
      orExplore: 'Or explore our services',
      viewServices: 'View All Services',
      consultationTitle: 'Free Consultation:',
      consultationText: ' We offer complimentary project assessment and consultation to ensure we understand your specific requirements.',
      responseTime: 'Response time: Within 2 hours during business hours | 24/7 WhatsApp support available'
    },
    ar: {
      title: 'جاهز لبدء مشروع الترجمة الخاص بك؟',
      desc: 'احصل على نفس الجودة الاحترافية والاهتمام بالتفاصيل التي جعلت هذا المشروع ناجحاً. فريقنا المتخصص مستعد لمساعدتك في تحقيق أهدافك.',
      projects: 'مشاريع مكتملة',
      clients: 'عملاء سعداء',
      quality: 'معدل الجودة',
      card1Title: 'احصل على تسعير فوري',
      card1Desc: 'تواصل معنا مباشرة للحصول على مساعدة فورية واستشارة مخصصة حول احتياجات الترجمة الخاصة بك.',
      whatsappLabel: 'واتساب',
      phoneLabel: 'اتصل بنا',
      emailLabel: 'البريد الإلكتروني',
      cardTitle: 'طلب عرض سعر مفصل',
      cardDesc: 'أرسل تفاصيل مشروعك عبر نموذج الاتصال للحصول على عرض سعر شامل وجدول زمني للمشروع.',
      getQuote: 'احصل على عرض سعر مفصل',
      orExplore: 'أو استكشف خدماتنا',
      viewServices: 'عرض جميع الخدمات',
      consultationTitle: 'استشارة مجانية:',
      consultationText: ' نقدم تقييماً واستشارة مجانية للمشروع لضمان فهمنا لمتطلباتك المحددة بدقة.',
      responseTime: 'وقت الاستجابة: خلال ساعتين أثناء ساعات العمل | دعم واتساب متاح على مدار الساعة 24/7'
    }
  }[locale] || {
    title: 'Ready to Start Your Translation Project?',
    desc: 'Get the same professional quality and attention to detail that made this project successful. Our expert team is ready to help you achieve your translation goals.',
    projects: 'Projects Completed',
    clients: 'Happy Clients',
    quality: 'Quality Score',
    card1Title: 'Get Instant Quote',
    card1Desc: 'Contact us directly for immediate assistance and personalized consultation about your translation needs.',
    whatsappLabel: 'WhatsApp',
    phoneLabel: 'Call',
    emailLabel: 'Email',
    cardTitle: 'Request Detailed Quote',
    cardDesc: 'Submit your project details through our contact form for a comprehensive quote and project timeline.',
    getQuote: 'Get Detailed Quote',
    orExplore: 'Or explore our services',
    viewServices: 'View All Services',
    consultationTitle: 'Free Consultation:',
    consultationText: ' We offer complimentary project assessment and consultation to ensure we understand your specific requirements.',
    responseTime: 'Response time: Within 2 hours during business hours | 24/7 WhatsApp support available'
  };

  // Contact information from memory
  const contactInfo = {
    phone: siteSettings.contact_phone || '+971 50 324 4329',
    whatsapp: siteSettings.whatsapp_number || '971503244329',
    email: siteSettings.contact_email || 'info@jusortrans.com'
  };

  const trustIndicators = [
    {
      icon: Star,
      value: '500+',
      label: text.projects,
      color: 'text-brand-orange'
    },
    {
      icon: Users,
      value: '200+',
      label: text.clients,
      color: 'text-brand-blue'
    },
    {
      icon: Award,
      value: '99.8%',
      label: text.quality,
      color: 'text-green-600'
    }
  ];

  const handleWhatsAppClick = () => {
    trackWhatsAppClick(contactInfo.whatsapp, 'project_detail_cta');
    const messageText = locale === 'ar'
      ? `مرحباً! أنا مهتم بخدمات الترجمة المشابهة لمشروع "${project.title}". هل يمكنك تزويدي بمزيد من المعلومات؟`
      : `Hi! I'm interested in translation services similar to the "${project.title}" project. Could you provide more information?`;
    const message = encodeURIComponent(messageText);
    window.open(`https://wa.me/${contactInfo.whatsapp}?text=${message}`, '_blank');
  };

  const handlePhoneClick = () => {
    trackPhoneClick(contactInfo.phone, 'project_detail_cta');
    window.open(`tel:${contactInfo.phone}`, '_self');
  };

  const handleEmailClick = () => {
    trackEmailClick(contactInfo.email, 'project_detail_cta');
    const subjectText = locale === 'ar'
      ? `استفسار عن خدمات الترجمة - ${project.title}`
      : `Inquiry about Translation Services - ${project.title}`;
    const bodyText = locale === 'ar'
      ? `مرحباً،\n\nأنا مهتم بخدمات الترجمة المشابهة لمشروع "${project.title}". هل يمكنك تزويدنا بمزيد من المعلومات عن خدماتكم وأسعاركم؟\n\nشكراً لكم!`
      : `Hello,\n\nI'm interested in translation services similar to your "${project.title}" project. Could you please provide more information about your services and pricing?\n\nThank you!`;
    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(bodyText);
    window.open(`mailto:${contactInfo.email}?subject=${subject}&body=${body}`, '_self');
  };

  return (
    <section 
      ref={ref}
      className="py-16 bg-gradient-to-br from-brand-blue to-brand-blue/90 text-white relative overflow-hidden"
      aria-labelledby="project-cta-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Content */}
          <div 
            className={`text-center mb-12 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 
              id="project-cta-heading"
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              {text.title}
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              {text.desc}
            </p>

            {/* Trust Indicators */}
            <div 
              className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <indicator.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {indicator.value}
                  </div>
                  <div className="text-blue-100 text-sm">
                    {indicator.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Cards */}
          <div 
            className={`grid md:grid-cols-2 gap-8 mb-12 transition-all duration-700 delay-300 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Quick Contact Card */}
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-left rtl:text-right">
                  {text.card1Title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-left rtl:text-right">
                  {text.card1Desc}
                </p>
                
                <div className="space-y-4">
                  <Button 
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white justify-start rtl:flex-row-reverse"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-3 rtl:mr-0 rtl:ml-3" />
                    <span>{text.whatsappLabel}: {contactInfo.phone}</span>
                  </Button>
                  
                  <Button 
                    onClick={handlePhoneClick}
                    variant="outline"
                    className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white justify-start rtl:flex-row-reverse"
                    size="lg"
                  >
                    <Phone className="h-5 w-5 mr-3 rtl:mr-0 rtl:ml-3" />
                    <span>{text.phoneLabel}: {contactInfo.phone}</span>
                  </Button>
                  
                  <Button 
                    onClick={handleEmailClick}
                    variant="outline"
                    className="w-full border-brand-orange text-brand-orangeText hover:bg-brand-orangeText hover:text-white justify-start rtl:flex-row-reverse"
                    size="lg"
                  >
                    <Mail className="h-5 w-5 mr-3 rtl:mr-0 rtl:ml-3" />
                    <span>{text.emailLabel}: {contactInfo.email}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Formal Quote Card */}
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-left rtl:text-right">
                  {text.cardTitle}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-left rtl:text-right">
                  {text.cardDesc}
                </p>
                
                <div className="space-y-4">
                  <Button 
                    asChild
                    className="w-full bg-brand-orangeText hover:bg-brand-orangeText/90 text-white"
                    size="lg"
                  >
                    <Link href={localizedPath("/contact#contact-form-section", locale)} className="rtl:flex-row-reverse">
                      <span>{text.getQuote}</span>
                      <ArrowRight className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
                    </Link>
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      {text.orExplore}
                    </p>
                    <Button 
                      asChild
                      variant="ghost"
                      className="text-brand-blue hover:text-brand-blue/80 hover:bg-brand-blue/10"
                    >
                      <Link href={localizedPath("/services", locale)} className="rtl:flex-row-reverse">
                        <span>{text.viewServices}</span>
                        <ArrowRight className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Message */}
          <div 
            className={`text-center transition-all duration-700 delay-400 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-lg text-blue-100 mb-4 leading-relaxed">
                <strong className="text-white">{text.consultationTitle}</strong>
                {text.consultationText}
              </p>
              <p className="text-blue-200">
                {text.responseTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
