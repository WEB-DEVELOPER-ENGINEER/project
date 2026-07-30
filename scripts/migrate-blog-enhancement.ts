#!/usr/bin/env npx tsx

/**
 * Blog Enhancement Migration Script
 * Populates new blog-related tables with initial data
 */

import { pool } from '../lib/database';

async function migrateBlogEnhancement() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting blog enhancement migration...');

    // Insert default blog authors
    // Note: this previously also inserted two entirely fictional personas
    // ("Dr. Sarah Johnson", "Michael Chen") with invented credentials
    // (PhD, ATA certification, court-certified interpreter status) that
    // don't correspond to real people at this company — removed. Only the
    // non-personal "JUSOR Team" byline is seeded; add real named authors
    // here once real people/bios are provided.
    console.log('📝 Creating default blog authors...');
    await client.query(`
      INSERT INTO blog_authors (name, slug, title, bio, expertise, achievements, social_links, is_active, sort_order) VALUES
      ('JUSOR Team', 'jusor-team', 'Translation & Localization Experts',
       'Our team of certified translators and localization specialists brings decades of combined experience in delivering high-quality language services across multiple industries. We are passionate about breaking down language barriers and helping businesses communicate effectively in global markets.',
       ARRAY['Legal Translation', 'Technical Documentation', 'Business Localization', 'Certified Translation'],
       ARRAY['Certified Translation Services', 'Professional Translation Services', 'Quality Assurance Process'],
       '{"email": "info@jusortrans.com", "linkedin": "https://linkedin.com/company/jusor", "website": "https://jusortrans.com"}',
       true, 1)
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Insert default blog categories
    console.log('📂 Creating default blog categories...');
    await client.query(`
      INSERT INTO blog_categories (name, slug, description, color, icon_name, is_active, sort_order) VALUES
      ('Legal Translation', 'legal', 'Legal document translation and court interpretation services', 'bg-blue-100 text-blue-800', 'Scale', true, 1),
      ('Technical Translation', 'technical', 'Technical documentation and software localization', 'bg-green-100 text-green-800', 'Code', true, 2),
      ('Business Translation', 'business', 'Business documents and corporate communication', 'bg-purple-100 text-purple-800', 'Briefcase', true, 3),
      ('Medical Translation', 'medical', 'Medical and pharmaceutical translation services', 'bg-red-100 text-red-800', 'Heart', true, 4),
      ('Academic Translation', 'academic', 'Academic papers and educational content', 'bg-yellow-100 text-yellow-800', 'GraduationCap', true, 5),
      ('Industry Insights', 'insights', 'Translation industry trends and insights', 'bg-orange-100 text-orange-800', 'TrendingUp', true, 6),
      ('General', 'general', 'General translation topics and news', 'bg-gray-100 text-gray-800', 'FileText', true, 7)
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Insert company metrics
    console.log('📊 Creating company metrics...');
    await client.query(`
      INSERT INTO company_metrics (metric_key, metric_value, metric_label, metric_description, category, icon_name, color_class, display_order, is_active) VALUES
      -- Statistics
      ('projects_completed', '500+', 'Projects Completed', 'Total number of successful translation projects', 'stats', 'CheckCircle', 'text-brand-orange', 1, true),
      ('language_pairs', '50+', 'Language Pairs', 'Number of language combinations we support', 'stats', 'Globe', 'text-brand-blue', 2, true),
      ('client_satisfaction', '99.8%', 'Client Satisfaction', 'Client satisfaction rate based on feedback', 'stats', 'Star', 'text-brand-orange', 3, true),
      ('support_availability', '24/7', 'Support Available', 'Round-the-clock customer support', 'stats', 'Clock', 'text-brand-blue', 4, true),
      
      -- Achievements
      ('years_experience', '15+', 'Years Experience', 'Years of professional translation experience', 'achievements', 'Calendar', 'text-blue-600', 2, true),
      ('certified_translators', '100+', 'Certified Translators', 'Number of certified professional translators', 'achievements', 'Users', 'text-purple-600', 3, true),
      
      -- Benefits
      ('quality_assurance', 'Quality Assured', 'Quality Assurance Process', 'Multi-step quality assurance process', 'benefits', 'CheckCircle', 'text-green-600', 1, true),
      ('confidentiality', 'Confidential', 'Confidentiality Guaranteed', 'Strict confidentiality and NDA protection', 'benefits', 'Shield', 'text-blue-600', 2, true),
      ('fast_turnaround', 'Fast Delivery', 'Fast Turnaround Times', 'Quick and efficient project delivery', 'benefits', 'Clock', 'text-orange-600', 3, true),
      ('competitive_pricing', 'Competitive', 'Competitive Pricing', 'Fair and transparent pricing structure', 'benefits', 'DollarSign', 'text-green-600', 4, true)
      ON CONFLICT (metric_key) DO NOTHING;
    `);

    // Insert blog content sections
    console.log('📄 Creating blog content sections...');
    await client.query(`
      INSERT INTO blog_content_sections (section_key, title, content, button_text, button_url, background_type, is_active, sort_order) VALUES
      ('cta_main', 'Need Professional Translation Services?', 
       'Our certified translation experts are ready to help you communicate effectively across languages and cultures.',
       'Get Free Quote', '/contact', 'gradient', true, 1),
      ('newsletter_signup', 'Stay Updated with Translation Insights',
       'Subscribe to our newsletter and get the latest industry trends, expert tips, and exclusive content delivered to your inbox.',
       'Subscribe to Newsletter', '/newsletter', 'default', true, 2),
      ('contact_cta', 'Ready to Get Started?',
       'Contact our team of translation experts for a free consultation and quote for your project.',
       'Contact Us Today', '/contact', 'solid', true, 3)
      ON CONFLICT (section_key) DO NOTHING;
    `);

    // Update existing blog posts to add reading time
    console.log('⏱️ Calculating reading time for existing posts...');
    const existingPosts = await client.query('SELECT id, content FROM blog_posts WHERE reading_time IS NULL');
    
    for (const post of existingPosts.rows) {
      const wordCount = post.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
      
      await client.query(
        'UPDATE blog_posts SET reading_time = $1 WHERE id = $2',
        [readingTime, post.id]
      );
    }

    console.log('✅ Blog enhancement migration completed successfully!');
    console.log(`
📋 Migration Summary:
- ✅ Blog authors table populated with default authors
- ✅ Blog categories table populated with default categories  
- ✅ Company metrics table populated with key metrics
- ✅ Blog content sections table populated with CTA sections
- ✅ Reading time calculated for existing blog posts

🎯 Next Steps:
1. Update React Admin to include new resources
2. Test blog post creation with new fields
3. Verify dynamic content is loading correctly
4. Update any hardcoded metrics in components
    `);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateBlogEnhancement()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export { migrateBlogEnhancement };