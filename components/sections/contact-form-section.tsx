'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Send, Loader2, Upload, FileText } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useToast } from '@/hooks/use-toast';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics-events';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { CONTACT_FORM_CONTENT } from '@/lib/content/contact-form-content';

interface ContactFormSectionProps {
  contactData: any;
  siteSettings?: Record<string, any>;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  service_type: string;
  message: string;
  source_language: string;
  target_language: string;
  document_type: string;
  word_count: string;
  deadline: string;
  certification_needed: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export function ContactFormSection({ contactData, siteSettings = {} }: ContactFormSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { locale } = useLanguage();
  const f = CONTACT_FORM_CONTENT[locale];
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    service_type: '',
    message: '',
    source_language: '',
    target_language: '',
    document_type: '',
    word_count: '',
    deadline: '',
    certification_needed: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const serviceTypes = f.serviceTypes;

  const languages = f.languages;

  const documentTypes = f.documentTypes;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = f.vNameRequired;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = f.vNameShort;
    }

    if (!formData.email.trim()) {
      newErrors.email = f.vEmailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = f.vEmailInvalid;
    }

    if (!formData.message.trim()) {
      newErrors.message = f.vMessageRequired;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = f.vMessageShort;
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = f.vPhoneInvalid;
    }

    if (formData.word_count && isNaN(Number(formData.word_count))) {
      newErrors.word_count = f.vNumberInvalid;
    }

    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      newErrors.deadline = f.vDeadlinePast;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: field === 'certification_needed' ? value === 'true' : value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
      return file.size <= maxSize && allowedTypes.includes(file.type);
    });
    
    if (validFiles.length !== files.length) {
      toast({
        title: f.tFileTitle,
        description: f.tFileBody,
        variant: "destructive",
      });
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: f.tValidationTitle,
        description: f.tValidationBody,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmData = {
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_term: urlParams.get('utm_term') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...utmData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: f.tSuccessTitle,
          description: f.tSuccessBody,
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          service_type: '',
          message: '',
          source_language: '',
          target_language: '',
          document_type: '',
          word_count: '',
          deadline: '',
          certification_needed: false
        });
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: f.tErrorTitle,
        description: f.tErrorBody,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section 
        id="contact-form-section"
        className="section-padding bg-white"
        aria-labelledby="contact-success-heading"
      >
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 id="contact-success-heading" className="text-2xl font-bold text-green-800 mb-2">
                    {f.successTitle}
                  </h2>
                  <p className="text-green-700 mb-6">
                    {f.successBody}
                  </p>
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="border-green-500 text-green-700 hover:bg-green-500 hover:text-white"
                  >
                    {f.successAgain}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="contact-form-section"
      ref={ref}
      className="section-padding bg-white"
      aria-labelledby="contact-form-heading"
    >
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 
              id="contact-form-heading"
              className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {f.heading}
            </h2>
            <p 
              className={`text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {f.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card 
                className={`shadow-lg border-0 transition-all duration-700 delay-200 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">{f.cardTitle}</CardTitle>
                  <CardDescription>
                    {f.cardDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          {f.fullName} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`mt-1 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder={f.phName}
                          required
                          aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        {errors.name && (
                          <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          {f.email} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`mt-1 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder={f.phEmail}
                          required
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                          <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone and Service Type Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                          {f.phone}
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`mt-1 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder={f.phPhone}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                        />
                        {errors.phone && (
                          <p id="phone-error" className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="service_type" className="text-sm font-medium text-gray-700">
                          {f.serviceType}
                        </Label>
                        <Select value={formData.service_type} onValueChange={(value) => handleInputChange('service_type', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={f.phService} />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceTypes.map((service) => (
                              <SelectItem key={service.value} value={service.value}>
                                {service.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Language Pair */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="source_language" className="text-sm font-medium text-gray-700">
                          {f.fromLanguage}
                        </Label>
                        <Select value={formData.source_language} onValueChange={(value) => handleInputChange('source_language', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={f.phSourceLang} />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((language) => (
                              <SelectItem key={language.value} value={language.value}>
                                {language.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="target_language" className="text-sm font-medium text-gray-700">
                          {f.toLanguage}
                        </Label>
                        <Select value={formData.target_language} onValueChange={(value) => handleInputChange('target_language', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={f.phTargetLang} />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((language) => (
                              <SelectItem key={language.value} value={language.value}>
                                {language.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Document Type and Word Count */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="document_type" className="text-sm font-medium text-gray-700">
                          {f.documentType}
                        </Label>
                        <Select value={formData.document_type} onValueChange={(value) => handleInputChange('document_type', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={f.phDocType} />
                          </SelectTrigger>
                          <SelectContent>
                            {documentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="word_count" className="text-sm font-medium text-gray-700">
                          {f.wordCount}
                        </Label>
                        <Input
                          id="word_count"
                          type="number"
                          value={formData.word_count}
                          onChange={(e) => handleInputChange('word_count', e.target.value)}
                          className={`mt-1 ${errors.word_count ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder={f.phWordCount}
                          min="1"
                          aria-describedby={errors.word_count ? 'word-count-error' : undefined}
                        />
                        {errors.word_count && (
                          <p id="word-count-error" className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.word_count}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Deadline and Certification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">
                          {f.deadline}
                        </Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => handleInputChange('deadline', e.target.value)}
                          className={`mt-1 ${errors.deadline ? 'border-red-500 focus:ring-red-500' : ''}`}
                          min={new Date().toISOString().split('T')[0]}
                          aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                        />
                        {errors.deadline && (
                          <p id="deadline-error" className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.deadline}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center pt-6">
                        <input
                          id="certification_needed"
                          type="checkbox"
                          checked={formData.certification_needed}
                          onChange={(e) => handleInputChange('certification_needed', e.target.checked.toString())}
                          className="h-4 w-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                        />
                        <Label htmlFor="certification_needed" className="ml-2 text-sm font-medium text-gray-700">
                          {f.certificationNeeded}
                        </Label>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                        {f.subject}
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="mt-1"
                        placeholder={f.phSubject}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                        {f.projectDetails} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className={`mt-1 min-h-[120px] ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder={f.phMessage}
                        required
                        aria-describedby={errors.message ? 'message-error' : 'message-help'}
                      />
                      {errors.message ? (
                        <p id="message-error" className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.message}
                        </p>
                      ) : (
                        <p id="message-help" className="mt-1 text-xs text-gray-500">
                          {f.messageHelp}
                        </p>
                      )}
                    </div>

                    {/* File Upload */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        {f.attachments}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-orange transition-colors duration-300">
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                          aria-describedby="file-upload-help"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium text-brand-orange hover:text-brand-orange/80">{f.clickToUpload}</span> {f.orDragDrop}
                          </p>
                          <p id="file-upload-help" className="text-xs text-gray-500">
                            {f.fileHint}
                          </p>
                        </label>
                      </div>
                      
                      {/* Selected Files */}
                      {selectedFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <span className="text-xs text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded"
                                aria-label={`${f.removeFile} ${file.name}`}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Privacy Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>{f.privacyLabel}</strong> {f.privacyBody}
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-orange/20"
                      aria-describedby="submit-button-help"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                          <span>{f.submitting}</span>
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" aria-hidden="true" />
                          <span>{f.submit}</span>
                        </>
                      )}
                    </Button>
                    <p id="submit-button-help" className="text-xs text-center text-gray-500 mt-2">
                      {f.submitHelp}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information Sidebar */}
            <div className="lg:col-span-1">
              <div 
                className={`space-y-6 transition-all duration-700 delay-400 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {/* Response Time */}
                <Card className="border-brand-orange/20 bg-brand-orange/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">{f.quickResponseTitle}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {f.quickResponseBody}
                    </p>
                    <div className="flex items-center text-sm text-brand-orange font-medium">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {f.quoteGuarantee}
                    </div>
                  </CardContent>
                </Card>

                {/* What to Include */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">{f.includeTitle}</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        {f.includeItems[0]}
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        {f.includeItems[1]}
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        {f.includeItems[2]}
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        {f.includeItems[3]}
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        {f.includeItems[4]}
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-red-800 mb-2">{f.urgentTitle}</h3>
                    <p className="text-sm text-red-700 mb-3">
                      {f.urgentBody}
                    </p>
                    <div className="space-y-2">
                      <a 
                        href={`tel:${contactData.phone}`}
                        onClick={() => trackPhoneClick(contactData.phone, 'contact_form_emergency')}
                        className="block text-sm font-medium text-red-800 hover:text-red-900"
                      >
                        📞 {contactData.phone}
                      </a>
                      <a 
                        href={`https://api.whatsapp.com/send?phone=${contactData.whatsapp_number}&text=${encodeURIComponent(f.urgentWhatsappMessage)}`}
                        onClick={() => trackWhatsAppClick(contactData.whatsapp_number, 'contact_form_emergency')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm font-medium text-red-800 hover:text-red-900"
                      >
                        💬 {f.urgentWhatsapp}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}