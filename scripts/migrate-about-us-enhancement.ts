#!/usr/bin/env npx tsx

/**
 * Database migration script for About Us page enhancement
 * Adds new columns to support comprehensive about page content management
 */

import { pool } from '../lib/database'

async function migrateAboutUsEnhancement() {
  const client = await pool.connect()
  
  try {
    console.log('🚀 Starting About Us enhancement migration...')
    
    // Add new columns to about_us table
    await client.query(`
      DO $$ 
      BEGIN
        -- Hero Section columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'hero_image_url') THEN
          ALTER TABLE about_us ADD COLUMN hero_image_url VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'hero_video_url') THEN
          ALTER TABLE about_us ADD COLUMN hero_video_url VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'hero_cta_primary_text') THEN
          ALTER TABLE about_us ADD COLUMN hero_cta_primary_text VARCHAR(100);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'hero_cta_primary_url') THEN
          ALTER TABLE about_us ADD COLUMN hero_cta_primary_url VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'hero_cta_secondary_text') THEN
          ALTER TABLE about_us ADD COLUMN hero_cta_secondary_text VARCHAR(100);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'hero_cta_secondary_url') THEN
          ALTER TABLE about_us ADD COLUMN hero_cta_secondary_url VARCHAR(500);
        END IF;
        
        -- Mission, Vision, Purpose columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'mission') THEN
          ALTER TABLE about_us ADD COLUMN mission TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'vision') THEN
          ALTER TABLE about_us ADD COLUMN vision TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'purpose') THEN
          ALTER TABLE about_us ADD COLUMN purpose TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'mission_image_url') THEN
          ALTER TABLE about_us ADD COLUMN mission_image_url VARCHAR(500);
        END IF;
        
        -- Company Story columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'story') THEN
          ALTER TABLE about_us ADD COLUMN story TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'story_continuation') THEN
          ALTER TABLE about_us ADD COLUMN story_continuation TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'story_image_url') THEN
          ALTER TABLE about_us ADD COLUMN story_image_url VARCHAR(500);
        END IF;
        
        -- Values Section columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'values') THEN
          ALTER TABLE about_us ADD COLUMN values JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'values_image_url') THEN
          ALTER TABLE about_us ADD COLUMN values_image_url VARCHAR(500);
        END IF;
        
        -- Timeline/History columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'timeline_phases') THEN
          ALTER TABLE about_us ADD COLUMN timeline_phases JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'timeline_image_url') THEN
          ALTER TABLE about_us ADD COLUMN timeline_image_url VARCHAR(500);
        END IF;
        
        -- Achievements & Certifications columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'achievements') THEN
          ALTER TABLE about_us ADD COLUMN achievements JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'certifications') THEN
          ALTER TABLE about_us ADD COLUMN certifications JSONB;
        END IF;
        
        -- Leadership Message columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'leadership_message') THEN
          ALTER TABLE about_us ADD COLUMN leadership_message TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'leadership_image_url') THEN
          ALTER TABLE about_us ADD COLUMN leadership_image_url VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'leadership_name') THEN
          ALTER TABLE about_us ADD COLUMN leadership_name VARCHAR(100);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'leadership_title') THEN
          ALTER TABLE about_us ADD COLUMN leadership_title VARCHAR(100);
        END IF;
        
        -- Call to Action columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'cta_title') THEN
          ALTER TABLE about_us ADD COLUMN cta_title VARCHAR(200);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'cta_description') THEN
          ALTER TABLE about_us ADD COLUMN cta_description TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'cta_primary_text') THEN
          ALTER TABLE about_us ADD COLUMN cta_primary_text VARCHAR(100);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'cta_primary_url') THEN
          ALTER TABLE about_us ADD COLUMN cta_primary_url VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'cta_secondary_text') THEN
          ALTER TABLE about_us ADD COLUMN cta_secondary_text VARCHAR(100);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'cta_secondary_url') THEN
          ALTER TABLE about_us ADD COLUMN cta_secondary_url VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'cta_background_image_url') THEN
          ALTER TABLE about_us ADD COLUMN cta_background_image_url VARCHAR(500);
        END IF;
        
        -- SEO & Meta columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'meta_title') THEN
          ALTER TABLE about_us ADD COLUMN meta_title VARCHAR(200);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'meta_description') THEN
          ALTER TABLE about_us ADD COLUMN meta_description TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'meta_keywords') THEN
          ALTER TABLE about_us ADD COLUMN meta_keywords TEXT[];
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'og_image_url') THEN
          ALTER TABLE about_us ADD COLUMN og_image_url VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'twitter_image_url') THEN
          ALTER TABLE about_us ADD COLUMN twitter_image_url VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'canonical_url') THEN
          ALTER TABLE about_us ADD COLUMN canonical_url VARCHAR(500);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'schema_markup') THEN
          ALTER TABLE about_us ADD COLUMN schema_markup JSONB;
        END IF;
        
        RAISE NOTICE 'About Us enhancement columns added successfully';
      END $$;
    `)
    
    // Insert default data if no about_us record exists
    const existingRecords = await client.query('SELECT COUNT(*) FROM about_us')
    const recordCount = parseInt(existingRecords.rows[0].count)
    
    if (recordCount === 0) {
      console.log('📝 Creating default About Us record...')
      
      await client.query(`
        INSERT INTO about_us (
          title, 
          slogan, 
          description, 
          hero_cta_primary_text,
          hero_cta_primary_url,
          hero_cta_secondary_text,
          hero_cta_secondary_url,
          mission,
          vision,
          purpose,
          story,
          story_continuation,
          cta_title,
          cta_description,
          cta_primary_text,
          cta_primary_url,
          cta_secondary_text,
          cta_secondary_url,
          meta_title,
          meta_description,
          is_active
        ) VALUES (
          'About JUSOR',
          'Breaking down language barriers and connecting cultures worldwide',
          'We are a leading provider of professional translation and localization services, dedicated to helping businesses communicate effectively across languages and cultures.',
          'Get Started Today',
          '/contact',
          'Our Services',
          '/services',
          'To break down language barriers and enable seamless global communication through accurate, culturally-sensitive translation and localization services that empower businesses to reach new markets and connect with diverse audiences worldwide.',
          'To be the world''s most trusted translation partner, recognized for our commitment to quality, innovation, and cultural understanding. We envision a world where language is never a barrier to human connection, business growth, or knowledge sharing.',
          'We exist to connect cultures, facilitate understanding, and enable global collaboration. Every translation we deliver is a bridge between communities, helping ideas flow freely across linguistic boundaries and fostering meaningful connections worldwide.',
          'Founded with a passion for bridging linguistic divides, JUSOR began as a small team of dedicated translators who believed that language should never be a barrier to success.',
          'Today, we serve clients across industries and continents, from startups taking their first steps into global markets to multinational corporations expanding their reach. Every project we undertake is an opportunity to facilitate understanding, enable growth, and contribute to a more connected world.',
          'Ready to Get Started?',
          'Let us help you break down language barriers and connect with your global audience.',
          'Contact Us',
          '/contact',
          'View Services',
          '/services',
          'About JUSOR | Professional Translation Services',
          'Learn about JUSOR, a leading provider of professional translation and localization services. Discover our mission, values, and expert team.',
          true
        )
      `)
      
      console.log('✅ Default About Us record created')
    } else {
      console.log('ℹ️  Existing About Us records found, skipping default data creation')
    }
    
    console.log('✅ About Us enhancement migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    client.release()
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateAboutUsEnhancement()
    .then(() => {
      console.log('🎉 Migration completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error)
      process.exit(1)
    })
}

export { migrateAboutUsEnhancement }