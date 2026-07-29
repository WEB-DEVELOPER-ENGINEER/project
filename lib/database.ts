/**
 * Database configuration and connection management
 * Production-ready PostgreSQL setup with connection pooling
 */

import { Pool } from 'pg';

// Load environment variables
if (typeof window === 'undefined') {
  // Server-side only
  const dotenv = require('dotenv');
  dotenv.config({ path: '.env.local' });
  dotenv.config({ path: '.env' });
}

// Database configuration with environment variables
// Fix SSL connection issues by modifying connection string
let connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (connectionString && process.env.NODE_ENV === 'development') {
  // In development, disable SSL to avoid certificate issues
  connectionString = connectionString.replace(/sslmode=require/g, 'sslmode=disable');
  if (!connectionString.includes('sslmode=')) {
    connectionString += connectionString.includes('?') ? '&sslmode=disable' : '?sslmode=disable';
  }
}

const dbConfig: any = {
  // Fallback to individual variables or connection string
  host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || process.env.POSTGRES_DATABASE || 'jusor_nextjs',
  user: process.env.DB_USERNAME || process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
  // SSL configuration - disable in development, enable in production
  ssl: process.env.NODE_ENV === 'production' && (process.env.DATABASE_URL || process.env.POSTGRES_URL) ? {
    rejectUnauthorized: false,
    require: true
  } : false,
  // Force IPv4 to avoid IPv6 connectivity issues
  family: 4,
  // Optimized pool settings for Next.js development and production
  max: process.env.NODE_ENV === 'production' ? 20 : 5, // Fewer connections in development
  idleTimeoutMillis: process.env.NODE_ENV === 'production' ? 30000 : 300000, // 5 minutes in dev, 30 seconds in prod
  connectionTimeoutMillis: 10000, // Increase timeout to 10 seconds
  // Additional optimizations
  allowExitOnIdle: process.env.NODE_ENV !== 'production', // Allow pool to close in development
};

if (connectionString) {
  dbConfig.connectionString = connectionString;
}

// Global variable to prevent multiple pool instances in development (Next.js hot reload)
declare global {
  var __db_pool: Pool | undefined;
}

// Create or reuse connection pool (prevents multiple instances during hot reload)
export const pool = globalThis.__db_pool ?? new Pool(dbConfig);

if (process.env.NODE_ENV !== 'production') {
  globalThis.__db_pool = pool;
}

// Pool error handling
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  // In production, you might want to restart the application or send alerts
});

// Only log connection events in production or when DEBUG is enabled
if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_DEBUG === 'true') {
  pool.on('connect', () => {
    console.log('Database client connected');
  });

  pool.on('remove', () => {
    console.log('Database client removed');
  });
}

// Database initialization and migration functions
export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Create tables with proper indexes and constraints
    await client.query(`
      -- Icons table
      CREATE TABLE IF NOT EXISTS icons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        icon_class VARCHAR(100),
        image_url VARCHAR(500),
        link VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for icons
      CREATE INDEX IF NOT EXISTS idx_icons_name ON icons(name);

      -- Top bar items
      CREATE TABLE IF NOT EXISTS top_bar_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        link VARCHAR(500) NOT NULL,
        icon_id INTEGER REFERENCES icons(id) ON DELETE CASCADE,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for top_bar_items
      CREATE INDEX IF NOT EXISTS idx_top_bar_items_active ON top_bar_items(is_active, sort_order);

      -- Header navigation items
      CREATE TABLE IF NOT EXISTS header_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        link VARCHAR(200),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for header_items
      CREATE INDEX IF NOT EXISTS idx_header_items_active ON header_items(is_active, sort_order);

      -- Sliders/Hero content
      CREATE TABLE IF NOT EXISTS sliders (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(500),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for sliders
      CREATE INDEX IF NOT EXISTS idx_sliders_active ON sliders(is_active, sort_order);

      -- Services
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        icon_id INTEGER REFERENCES icons(id) ON DELETE SET NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for services
      CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active, sort_order);
      CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

      -- Clients
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Client images
      CREATE TABLE IF NOT EXISTS client_images (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        alt_text VARCHAR(200),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for client_images
      CREATE INDEX IF NOT EXISTS idx_client_images_client ON client_images(client_id, sort_order);

      -- Projects
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        
        -- Project Meta Information
        category VARCHAR(100),
        status VARCHAR(50) DEFAULT 'completed',
        project_date DATE,
        languages TEXT[], -- Array of languages involved
        industry VARCHAR(100),
        team_size INTEGER,
        word_count INTEGER,
        duration_days INTEGER,
        
        -- Content Section Fields
        challenge TEXT,
        solution TEXT,
        scope TEXT[], -- Array of scope items
        deliverables TEXT[], -- Array of deliverable items
        
        -- Specifications
        technical_details JSONB, -- Technical specifications as JSON
        process_details JSONB, -- Process specifications as JSON
        quality_metrics JSONB, -- Quality metrics with scores
        certifications TEXT[], -- Array of certifications
        
        -- Results & Impact
        key_metrics JSONB, -- Key performance metrics
        impact_outcomes TEXT[], -- Array of impact outcomes
        client_testimonial JSONB, -- Client testimonial data
        achievements JSONB, -- Project achievements
        
        -- Timeline & Process
        timeline_phases JSONB, -- Project timeline phases
        
        -- SEO & Meta
        meta_title VARCHAR(200),
        meta_description TEXT,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for projects
      CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active, sort_order);
      CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

      -- Project images
      CREATE TABLE IF NOT EXISTS project_images (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        description TEXT,
        alt_text VARCHAR(200),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for project_images
      CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id, sort_order);

      -- Blog authors table (must be created first for foreign key references)
      CREATE TABLE IF NOT EXISTS blog_authors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(200),
        bio TEXT,
        image_url VARCHAR(500),
        email VARCHAR(255),
        expertise TEXT[], -- Array of expertise areas
        achievements TEXT[], -- Array of achievements
        social_links JSONB, -- Social media links
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Blog categories table (must be created before blog_posts for foreign key references)
      CREATE TABLE IF NOT EXISTS blog_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        color VARCHAR(50), -- CSS color class
        icon_name VARCHAR(50), -- Lucide icon name
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Blog posts table already exists, add new columns if they don't exist
      DO $$ 
      BEGIN
        ALTER TABLE blog_posts ALTER COLUMN title TYPE VARCHAR(500);
        ALTER TABLE blog_posts ALTER COLUMN slug TYPE VARCHAR(500);
        ALTER TABLE blog_posts ALTER COLUMN meta_title TYPE VARCHAR(500);
        ALTER TABLE blog_posts ALTER COLUMN meta_description TYPE VARCHAR(1000);

        -- Add new columns to existing blog_posts table
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'author_id') THEN
          ALTER TABLE blog_posts ADD COLUMN author_id INTEGER REFERENCES blog_authors(id) ON DELETE SET NULL;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'featured') THEN
          ALTER TABLE blog_posts ADD COLUMN featured BOOLEAN DEFAULT false;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'reading_time') THEN
          ALTER TABLE blog_posts ADD COLUMN reading_time INTEGER;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'view_count') THEN
          ALTER TABLE blog_posts ADD COLUMN view_count INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'category_id') THEN
          ALTER TABLE blog_posts ADD COLUMN category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'tags') THEN
          ALTER TABLE blog_posts ADD COLUMN tags TEXT[];
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'excerpt') THEN
          ALTER TABLE blog_posts ADD COLUMN excerpt TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'table_of_contents') THEN
          ALTER TABLE blog_posts ADD COLUMN table_of_contents JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'related_services') THEN
          ALTER TABLE blog_posts ADD COLUMN related_services TEXT[];
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'related_projects') THEN
          ALTER TABLE blog_posts ADD COLUMN related_projects TEXT[];
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'og_image') THEN
          ALTER TABLE blog_posts ADD COLUMN og_image VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'twitter_image') THEN
          ALTER TABLE blog_posts ADD COLUMN twitter_image VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'canonical_url') THEN
          ALTER TABLE blog_posts ADD COLUMN canonical_url VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'schema_markup') THEN
          ALTER TABLE blog_posts ADD COLUMN schema_markup JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'social_shares') THEN
          ALTER TABLE blog_posts ADD COLUMN social_shares JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'engagement_metrics') THEN
          ALTER TABLE blog_posts ADD COLUMN engagement_metrics JSONB;
        END IF;
      END $$;

      -- Create indexes for blog_authors
      CREATE INDEX IF NOT EXISTS idx_blog_authors_slug ON blog_authors(slug);
      CREATE INDEX IF NOT EXISTS idx_blog_authors_active ON blog_authors(is_active, sort_order);

      -- Create indexes for blog_categories
      CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
      CREATE INDEX IF NOT EXISTS idx_blog_categories_active ON blog_categories(is_active, sort_order);

      -- Create indexes for blog_posts
      CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_date DESC);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured, is_published);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

      -- Blog content sections (for dynamic content blocks)
      CREATE TABLE IF NOT EXISTS blog_content_sections (
        id SERIAL PRIMARY KEY,
        section_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'cta_main', 'newsletter_signup'
        title VARCHAR(200),
        content TEXT,
        button_text VARCHAR(100),
        button_url VARCHAR(500),
        background_type VARCHAR(20) DEFAULT 'default',
        background_value VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Company metrics (for dynamic stats display)
      CREATE TABLE IF NOT EXISTS company_metrics (
        id SERIAL PRIMARY KEY,
        metric_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'projects_completed', 'client_satisfaction'
        metric_value VARCHAR(50) NOT NULL, -- e.g., '500+', '99.8%'
        metric_label VARCHAR(100) NOT NULL, -- e.g., 'Projects Completed'
        metric_description TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        category VARCHAR(50), -- e.g., 'stats', 'achievements', 'certifications'
        icon_name VARCHAR(50), -- Lucide icon name
        color_class VARCHAR(50), -- CSS color class
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );


      -- Testimonials
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        company VARCHAR(100),
        position VARCHAR(100),
        image_url VARCHAR(500),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for testimonials
      CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active, sort_order);

      -- Team members
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        job_title VARCHAR(100) NOT NULL,
        image_url VARCHAR(500),
        bio TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for team_members
      CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active, sort_order);

      -- Team member social links (many-to-many with icons)
      CREATE TABLE IF NOT EXISTS team_member_social_links (
        id SERIAL PRIMARY KEY,
        team_member_id INTEGER REFERENCES team_members(id) ON DELETE CASCADE,
        icon_id INTEGER REFERENCES icons(id) ON DELETE CASCADE,
        url VARCHAR(500) NOT NULL,
        sort_order INTEGER DEFAULT 0,
        UNIQUE(team_member_id, icon_id)
      );

      -- About us content (Enhanced for production)
      CREATE TABLE IF NOT EXISTS about_us (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        slogan VARCHAR(1000),
        description TEXT NOT NULL,
        
        -- Hero Section
        hero_image_url VARCHAR(500),
        hero_video_url VARCHAR(500),
        hero_cta_primary_text VARCHAR(100),
        hero_cta_primary_url VARCHAR(500),
        hero_cta_secondary_text VARCHAR(100),
        hero_cta_secondary_url VARCHAR(500),
        
        -- Mission, Vision, Purpose
        mission TEXT,
        vision TEXT,
        purpose TEXT,
        mission_image_url VARCHAR(500),
        
        -- Company Story
        story TEXT,
        story_continuation TEXT,
        story_image_url VARCHAR(500),
        
        -- Values Section
        values JSONB, -- Array of value objects with title, description, icon
        values_image_url VARCHAR(500),
        
        -- Timeline/History
        timeline_phases JSONB, -- Array of timeline phases
        timeline_image_url VARCHAR(500),
        
        -- Achievements & Certifications
        achievements JSONB, -- Array of achievement objects
        certifications JSONB, -- Array of certification objects
        
        -- Leadership Message
        leadership_message TEXT,
        leadership_image_url VARCHAR(500),
        leadership_name VARCHAR(100),
        leadership_title VARCHAR(100),
        
        -- Call to Action
        cta_title VARCHAR(200),
        cta_description TEXT,
        cta_primary_text VARCHAR(100),
        cta_primary_url VARCHAR(500),
        cta_secondary_text VARCHAR(100),
        cta_secondary_url VARCHAR(500),
        cta_background_image_url VARCHAR(500),
        
        -- SEO & Meta
        meta_title VARCHAR(200),
        meta_description TEXT,
        meta_keywords TEXT[],
        og_image_url VARCHAR(500),
        twitter_image_url VARCHAR(500),
        canonical_url VARCHAR(500),
        schema_markup JSONB,
        
        -- Legacy field
        image_url VARCHAR(500), -- Keep for backward compatibility
        
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );


      -- Contact form submissions
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        phone VARCHAR(20),
        service_type VARCHAR(100),
        status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'spam')),
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        utm_term VARCHAR(100),
        utm_content VARCHAR(100),
        ip_address INET,
        user_agent TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for contact_submissions
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status, submitted_at DESC);
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

      -- SEO metadata for dynamic pages
      CREATE TABLE IF NOT EXISTS seo_metadata (
        id SERIAL PRIMARY KEY,
        page_type VARCHAR(50) NOT NULL, -- 'blog', 'service', etc.
        page_id INTEGER, -- Reference to the specific page
        meta_title VARCHAR(60),
        meta_description VARCHAR(160),
        canonical_url VARCHAR(500),
        og_title VARCHAR(60),
        og_description VARCHAR(160),
        og_image VARCHAR(500),
        twitter_title VARCHAR(60),
        twitter_description VARCHAR(160),
        twitter_image VARCHAR(500),
        schema_markup JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(page_type, page_id)
      );

      -- Create indexes for seo_metadata
      CREATE INDEX IF NOT EXISTS idx_seo_metadata_page ON seo_metadata(page_type, page_id);

      -- Analytics tracking
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_name VARCHAR(100) NOT NULL,
        event_category VARCHAR(50),
        event_label VARCHAR(100),
        event_value INTEGER,
        page_url VARCHAR(500),
        referrer VARCHAR(500),
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        utm_term VARCHAR(100),
        utm_content VARCHAR(100),
        user_id VARCHAR(100),
        session_id VARCHAR(100),
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for analytics_events
      CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id, created_at DESC);

      -- Company information and site settings
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type VARCHAR(20) DEFAULT 'text', -- text, json, boolean, number
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for site_settings
      CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

      -- Features for dynamic feature sections
      CREATE TABLE IF NOT EXISTS features (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        icon_name VARCHAR(50), -- Lucide icon name
        icon_color VARCHAR(50), -- CSS color class
        category VARCHAR(50), -- Used to group features by sections
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for features
      CREATE INDEX IF NOT EXISTS idx_features_category ON features(category, is_active, sort_order);

      -- Footer sections for dynamic footer content
      CREATE TABLE IF NOT EXISTS footer_sections (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        section_type VARCHAR(50) NOT NULL, -- main, legal, social, newsletter
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Footer links
      CREATE TABLE IF NOT EXISTS footer_links (
        id SERIAL PRIMARY KEY,
        footer_section_id INTEGER REFERENCES footer_sections(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        url VARCHAR(500) NOT NULL,
        icon_id INTEGER REFERENCES icons(id) ON DELETE SET NULL,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for footer_links
      CREATE INDEX IF NOT EXISTS idx_footer_links_section ON footer_links(footer_section_id, is_active, sort_order);

      -- CTA sections for call-to-action content
      CREATE TABLE IF NOT EXISTS cta_sections (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        primary_button_text VARCHAR(100),
        primary_button_url VARCHAR(500),
        secondary_button_text VARCHAR(100),
        secondary_button_url VARCHAR(500),
        background_type VARCHAR(20) DEFAULT 'gradient', -- gradient, image, solid
        background_value VARCHAR(500),
        section_location VARCHAR(50), -- homepage, about, contact, etc.
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for cta_sections
      CREATE INDEX IF NOT EXISTS idx_cta_sections_location ON cta_sections(section_location, is_active, sort_order);

      -- CTA benefits/features
      CREATE TABLE IF NOT EXISTS cta_benefits (
        id SERIAL PRIMARY KEY,
        cta_section_id INTEGER REFERENCES cta_sections(id) ON DELETE CASCADE,
        benefit_text VARCHAR(200) NOT NULL,
        icon_name VARCHAR(50), -- Lucide icon name
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for cta_benefits
      CREATE INDEX IF NOT EXISTS idx_cta_benefits_section ON cta_benefits(cta_section_id, sort_order);

      -- Admin users table for React Admin authentication
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for admin_users
      CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
      CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

      -- Update triggers for updated_at columns
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Apply update triggers to all tables with updated_at
      DROP TRIGGER IF EXISTS update_icons_updated_at ON icons;
      CREATE TRIGGER update_icons_updated_at BEFORE UPDATE ON icons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_top_bar_items_updated_at ON top_bar_items;
      CREATE TRIGGER update_top_bar_items_updated_at BEFORE UPDATE ON top_bar_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_header_items_updated_at ON header_items;
      CREATE TRIGGER update_header_items_updated_at BEFORE UPDATE ON header_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_sliders_updated_at ON sliders;
      CREATE TRIGGER update_sliders_updated_at BEFORE UPDATE ON sliders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_services_updated_at ON services;
      CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
      CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
      CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
      CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_blog_authors_updated_at ON blog_authors;
      CREATE TRIGGER update_blog_authors_updated_at BEFORE UPDATE ON blog_authors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
      CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_blog_content_sections_updated_at ON blog_content_sections;
      CREATE TRIGGER update_blog_content_sections_updated_at BEFORE UPDATE ON blog_content_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_company_metrics_updated_at ON company_metrics;
      CREATE TRIGGER update_company_metrics_updated_at BEFORE UPDATE ON company_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
      CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
      CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_about_us_updated_at ON about_us;
      CREATE TRIGGER update_about_us_updated_at BEFORE UPDATE ON about_us FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



      DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
      CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_seo_metadata_updated_at ON seo_metadata;
      CREATE TRIGGER update_seo_metadata_updated_at BEFORE UPDATE ON seo_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
      CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Helper function to execute queries with error handling
export async function executeQuery(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});