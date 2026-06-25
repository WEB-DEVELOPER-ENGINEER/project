/**
 * TypeScript interfaces for the JUSOR translation services application
 * Production-ready type definitions with proper validation
 */

// Base interface for all database entities
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

// Icon interface
export interface Icon extends BaseEntity {
  name: string;
  icon_class?: string;
  image_url?: string;
  link?: string;
}

// Top bar item interface
export interface TopBarItem extends BaseEntity {
  name: string;
  link: string;
  icon_id: number;
  icon?: Icon;
  sort_order: number;
  is_active: boolean;
}

// Header navigation item interface
export interface HeaderItem extends BaseEntity {
  name: string;
  link?: string;
  sort_order: number;
  is_active: boolean;
}

// Slider/Hero content interface with enhanced media support
export interface Slider extends BaseEntity {
  title: string;
  description: string;
  
  // Media type and URLs
  media_type: 'image' | 'video';
  image_url?: string;
  video_url?: string;
  video_thumbnail_url?: string;
  
  // Enhanced video URL properties
  video_platform?: 'youtube' | 'vimeo' | 'direct' | 'wistia' | 'brightcove' | 'jwplayer';
  video_embed_id?: string; // Platform-specific video ID
  video_quality?: 'sd' | 'hd' | '4k' | 'auto';
  video_start_time?: number; // Start time in seconds
  video_end_time?: number; // End time in seconds
  video_privacy_mode?: boolean; // Privacy-enhanced mode for platforms like YouTube
  
  // Video playback properties
  video_duration?: number; // Duration in seconds
  video_autoplay?: boolean;
  video_muted?: boolean;
  video_loop?: boolean;
  
  // Accessibility and SEO
  media_alt_text?: string;
  media_caption?: string;
  
  // Performance optimization
  lazy_loading?: boolean;
  responsive_breakpoints?: ResponsiveBreakpoints;
  seo_metadata?: MediaSEOMetadata;
  
  // Core properties
  sort_order: number;
  is_active: boolean;
}

// Responsive breakpoints interface for optimized media delivery
export interface ResponsiveBreakpoints {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  large?: string;
  [key: string]: string | undefined;
}

// SEO metadata interface for media content
export interface MediaSEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  structured_data?: any;
  [key: string]: any;
}

// Service interface
export interface Service extends BaseEntity {
  title: string;
  content: string;
  icon_id?: number;
  icon?: Icon;
  slug: string;
  sort_order: number;
  is_active: boolean;
  
  // Enhanced service content fields
  short_description?: string;
  overview?: string;
  key_benefits?: string[];
  service_features?: ServiceFeature[];
  process_steps?: ServiceProcessStep[];
  service_highlights?: ServiceHighlights;
  specifications?: ServiceSpecifications;
  success_metrics?: ServiceSuccessMetrics;
  client_testimonial?: ServiceTestimonial;
  related_services?: string[];
  service_category?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
    color: string;
  };
  category_id?: number;
  service_type?: string;
  pricing_model?: string;
  delivery_time?: string;
  team_size?: string;
  languages_supported?: string[];
  certifications?: string[];
  industry_focus?: string[];
  service_tags?: string[];
  cta_primary_text?: string;
  cta_secondary_text?: string;
  cta_primary_url?: string;
  cta_secondary_url?: string;
  hero_image_url?: string;
  gallery_images?: ServiceGalleryImage[];
  video_url?: string;
  faq_items?: ServiceFAQItem[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  schema_markup?: any;
}

// Service Feature interface
export interface ServiceFeature {
  icon?: string;
  title: string;
  description: string;
}

// Service Process Step interface
export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
  icon?: string;
}

// Service Highlights interface
export interface ServiceHighlights {
  delivery_time?: string;
  team_size?: string;
  support?: string;
  guarantee?: string;
  turnaround?: string;
  certification?: string;
  [key: string]: any;
}

// Service Specifications interface
export interface ServiceSpecifications {
  document_types?: string[];
  industries?: string[];
  formats?: string[];
  tools?: string[];
  specializations?: string[];
  compliance?: string[];
  security?: string[];
  [key: string]: any;
}

// Service Success Metrics interface
export interface ServiceSuccessMetrics {
  accuracy_rate?: string;
  client_satisfaction?: string;
  projects_completed?: string;
  average_turnaround?: string;
  court_acceptance?: string;
  technical_validity?: string;
  languages_supported?: string;
  industries_served?: string;
  [key: string]: any;
}

// Service Testimonial interface
export interface ServiceTestimonial {
  quote?: string;
  author?: string;
  company?: string;
  position?: string;
  rating?: number;
  [key: string]: any;
}

// Service Gallery Image interface
export interface ServiceGalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

// Service FAQ Item interface
export interface ServiceFAQItem {
  question: string;
  answer: string;
}

// Client interface
export interface Client extends BaseEntity {
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  images?: ClientImage[];
}

// Client image interface
export interface ClientImage {
  id: number;
  client_id: number;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  created_at: string;
}

// Project interface
export interface Project extends BaseEntity {
  title: string;
  description: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  images?: ProjectImage[];
  
  // Project Meta Information
  category?: string;
  status?: string;
  project_date?: string;
  languages?: string[];
  industry?: string;
  team_size?: number;
  word_count?: number;
  duration_days?: number;
  
  // Content Section Fields
  challenge?: string;
  solution?: string;
  scope?: string[];
  deliverables?: string[];
  
  // Specifications
  technical_details?: ProjectTechnicalDetails;
  process_details?: ProjectProcessDetails;
  quality_metrics?: ProjectQualityMetrics;
  certifications?: string[];
  
  // Results & Impact
  key_metrics?: ProjectKeyMetrics;
  impact_outcomes?: string[];
  client_testimonial?: ProjectTestimonial;
  achievements?: ProjectAchievement[];
  
  // Timeline & Process
  timeline_phases?: ProjectTimelinePhase[];
  
  // SEO & Meta
  meta_title?: string;
  meta_description?: string;
}

// Project image interface
export interface ProjectImage {
  id: number;
  project_id: number;
  image_url: string;
  description?: string;
  alt_text?: string;
  sort_order: number;
  created_at: string;
}

// Project Technical Details
export interface ProjectTechnicalDetails {
  source_language?: string;
  target_language?: string;
  document_type?: string;
  file_format?: string;
  page_count?: number;
  [key: string]: any;
}

// Project Process Details
export interface ProjectProcessDetails {
  review_rounds?: number;
  quality_checks?: number;
  delivery_method?: string;
  [key: string]: any;
}

// Project Quality Metrics
export interface ProjectQualityMetrics {
  translation_accuracy?: number;
  cultural_adaptation?: number;
  terminology_consistency?: number;
  client_satisfaction?: number;
  [key: string]: any;
}

// Project Key Metrics
export interface ProjectKeyMetrics {
  accuracy_rate?: string;
  delivery_time?: string;
  client_satisfaction?: string;
  quality_score?: string;
  [key: string]: any;
}

// Project Testimonial
export interface ProjectTestimonial {
  quote?: string;
  author?: string;
  company?: string;
  rating?: number;
  [key: string]: any;
}

// Project Achievement
export interface ProjectAchievement {
  icon?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

// Project Timeline Phase
export interface ProjectTimelinePhase {
  id?: number;
  phase?: string;
  date?: string;
  status?: string;
  icon?: string;
  title?: string;
  description?: string;
  details?: string[];
  duration?: string;
  [key: string]: any;
}

// Blog post interface
export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url?: string;
  author_id?: number;
  author: string; // Fallback for backward compatibility
  published_date: string;
  is_published: boolean;
  featured?: boolean;
  reading_time?: number;
  view_count?: number;
  category_id?: number;
  tags?: string[];
  
  // Enhanced content sections
  excerpt?: string;
  table_of_contents?: any;
  related_services?: string[];
  related_projects?: string[];
  
  // SEO and Social
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  twitter_image?: string;
  canonical_url?: string;
  schema_markup?: any;
  
  // Analytics and engagement
  social_shares?: any;
  engagement_metrics?: any;
  
  // Relationships
  blog_author?: BlogAuthor;
  blog_category?: BlogCategory;
}

// Blog author interface
export interface BlogAuthor extends BaseEntity {
  name: string;
  slug: string;
  title?: string;
  bio?: string;
  image_url?: string;
  email?: string;
  expertise?: string[];
  achievements?: string[];
  social_links?: any;
  is_active: boolean;
  sort_order: number;
}

// Blog category interface
export interface BlogCategory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon_name?: string;
  is_active: boolean;
  sort_order: number;
}

// Blog content section interface
export interface BlogContentSection extends BaseEntity {
  section_key: string;
  title?: string;
  content?: string;
  button_text?: string;
  button_url?: string;
  background_type: string;
  background_value?: string;
  is_active: boolean;
  sort_order: number;
}

// Company metrics interface
export interface CompanyMetric extends BaseEntity {
  metric_key: string;
  metric_value: string;
  metric_label: string;
  metric_description?: string;
  display_order: number;
  is_active: boolean;
  category?: string;
  icon_name?: string;
  color_class?: string;
}

// Testimonial interface
export interface Testimonial extends BaseEntity {
  name: string;
  description: string;
  company?: string;
  position?: string;
  image_url?: string;
  rating: number;
  sort_order: number;
  is_active: boolean;
}

// Team member interface
export interface TeamMember extends BaseEntity {
  name: string;
  job_title: string;
  image_url?: string;
  bio?: string;
  sort_order: number;
  is_active: boolean;
  social_links?: TeamMemberSocialLink[];
}

// Team member social link interface
export interface TeamMemberSocialLink {
  id: number;
  team_member_id: number;
  icon_id: number;
  icon?: Icon;
  url: string;
  sort_order: number;
}

// About us interface (Enhanced for production)
export interface AboutUs extends BaseEntity {
  title: string;
  slogan?: string;
  description: string;
  
  // Hero Section
  hero_image_url?: string;
  hero_video_url?: string;
  hero_cta_primary_text?: string;
  hero_cta_primary_url?: string;
  hero_cta_secondary_text?: string;
  hero_cta_secondary_url?: string;
  
  // Mission, Vision, Purpose
  mission?: string;
  vision?: string;
  purpose?: string;
  mission_image_url?: string;
  
  // Company Story
  story?: string;
  story_continuation?: string;
  story_image_url?: string;
  
  // Values Section
  values?: AboutValue[];
  values_image_url?: string;
  
  // Timeline/History
  timeline_phases?: AboutTimelinePhase[];
  timeline_image_url?: string;
  
  // Achievements & Certifications
  achievements?: AboutAchievement[];
  certifications?: AboutCertification[];
  
  // Leadership Message
  leadership_message?: string;
  leadership_image_url?: string;
  leadership_name?: string;
  leadership_title?: string;
  
  // Call to Action
  cta_title?: string;
  cta_description?: string;
  cta_primary_text?: string;
  cta_primary_url?: string;
  cta_secondary_text?: string;
  cta_secondary_url?: string;
  cta_background_image_url?: string;
  
  // SEO & Meta
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_image_url?: string;
  twitter_image_url?: string;
  canonical_url?: string;
  schema_markup?: any;
  
  // Legacy field (backward compatibility)
  image_url?: string;
  
  is_active: boolean;
}

// About Value interface
export interface AboutValue {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  sort_order?: number;
}

// About Timeline Phase interface
export interface AboutTimelinePhase {
  id?: string;
  year: string;
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  sort_order?: number;
}

// About Achievement interface
export interface AboutAchievement {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  value?: string;
  category?: string;
  sort_order?: number;
}

// About Certification interface
export interface AboutCertification {
  id?: string;
  name: string;
  issuer: string;
  date_issued?: string;
  expiry_date?: string;
  certificate_url?: string;
  image_url?: string;
  description?: string;
  sort_order?: number;
}


// Contact submission interface
export interface ContactSubmission extends BaseEntity {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  service_type?: string;
  status: 'new' | 'in_progress' | 'completed' | 'spam';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ip_address?: string;
  user_agent?: string;
  submitted_at: string;
}

// SEO metadata interface
export interface SEOMetadata extends BaseEntity {
  page_type: string;
  page_id?: number;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema_markup?: any;
}

// Analytics event interface
export interface AnalyticsEvent {
  id: number;
  event_name: string;
  event_category?: string;
  event_label?: string;
  event_value?: number;
  page_url?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  user_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Feature interface
export interface Feature extends BaseEntity {
  title: string;
  description: string;
  icon_name?: string;
  icon_color?: string;
  category?: string;
  sort_order: number;
  is_active: boolean;
}

// CTA Section interface
export interface CTASection extends BaseEntity {
  title: string;
  description?: string;
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  background_type: string;
  background_value?: string;
  section_location: string;
  sort_order: number;
  is_active: boolean;
  benefits?: CTABenefit[];
}

// CTA Benefit interface
export interface CTABenefit {
  id: number;
  cta_section_id: number;
  benefit_text: string;
  icon_name?: string;
  sort_order: number;
}

// Footer Section interface
export interface FooterSection extends BaseEntity {
  title: string;
  section_type: string;
  sort_order: number;
  is_active: boolean;
}

// Footer Link interface
export interface FooterLink extends BaseEntity {
  footer_section_id: number;
  name: string;
  url: string;
  icon_id?: number;
  icon?: Icon;
  sort_order: number;
  is_active: boolean;
}

// Site Settings interface
export interface SiteSetting extends BaseEntity {
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description?: string;
  is_active: boolean;
}

// Homepage data interface (aggregated data for homepage)
export interface HomepageData {
  sliders: Slider[];
  services: Service[];
  about_us?: AboutUs;
  clients: Client[];
  projects: Project[];
  testimonials: Testimonial[];
  team_members: TeamMember[];
  recent_blogs: BlogPost[];
  features: Feature[];
  cta_sections: CTASection[];
  site_settings: Record<string, any>;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  error?: string;
}

// Form interfaces for validation
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  service_type?: string;
}


// Admin user interface
export interface AdminUser extends BaseEntity {
  email: string;
  password_hash: string;
  name: string;
  role: string;
  is_active: boolean;
  last_login?: string;
}

// Admin login form data
export interface AdminLoginFormData {
  email: string;
  password: string;
}

// SEO page data interface
export interface SEOPageData {
  title: string;
  description: string;
  canonical_url: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema_markup?: any;
}

// Navigation data interface
export interface NavigationData {
  top_bar_items: TopBarItem[];
  header_items: HeaderItem[];
}

// Image optimization interface
export interface OptimizedImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Translation service types (specific to JUSOR business)
export type TranslationServiceType = 
  | 'legal'
  | 'technical' 
  | 'business'
  | 'medical'
  | 'academic'
  | 'certified'
  | 'interpretation'
  | 'localization';

// Language pairs interface
export interface LanguagePair {
  source_language: string;
  target_language: string;
  is_certified: boolean;
  specializations: TranslationServiceType[];
}

// Quote request interface (for translation services)
export interface QuoteRequest extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_type: TranslationServiceType;
  source_language: string;
  target_language: string;
  document_type: string;
  word_count?: number;
  deadline?: string;
  special_requirements?: string;
  status: 'new' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  quote_amount?: number;
  quote_currency: string;
  estimated_delivery?: string;
}

// Admin dashboard interfaces
export interface DashboardStats {
  total_contacts: number;
  total_applications: number;
  total_quotes: number;
  pending_applications: number;
  new_contacts: number;
  monthly_growth: number;
  popular_services: Array<{
    service: string;
    count: number;
  }>;
}

// Error handling interfaces
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  validation_errors?: ValidationError[];
}

// File upload interfaces
export interface FileUploadResult {
  success: boolean;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  error?: string;
}

// Cache interfaces
export interface CacheConfig {
  key: string;
  ttl: number; // Time to live in seconds
  tags?: string[];
}

// Search interfaces
export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters?: Record<string, any>;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
  limit?: number;
  offset?: number;
}