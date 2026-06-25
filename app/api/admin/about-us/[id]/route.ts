import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const aboutusCRUD = new AdminCRUD(
  'about_us',
  [
    'title', 'slogan', 'description', 'image_url', 'is_active',
    // Hero Section
    'hero_image_url', 'hero_video_url', 'hero_cta_primary_text', 'hero_cta_primary_url',
    'hero_cta_secondary_text', 'hero_cta_secondary_url',
    // Mission, Vision, Purpose
    'mission', 'vision', 'purpose', 'mission_image_url',
    // Company Story
    'story', 'story_continuation', 'story_image_url',
    // Values Section
    'values', 'values_image_url',
    // Timeline/History
    'timeline_phases', 'timeline_image_url',
    // Achievements & Certifications
    'achievements', 'certifications',
    // Leadership Message
    'leadership_message', 'leadership_image_url', 'leadership_name', 'leadership_title',
    // Call to Action
    'cta_title', 'cta_description', 'cta_primary_text', 'cta_primary_url',
    'cta_secondary_text', 'cta_secondary_url', 'cta_background_image_url',
    // SEO & Meta
    'meta_title', 'meta_description', 'meta_keywords', 'og_image_url',
    'twitter_image_url', 'canonical_url', 'schema_markup'
  ],
  ['title', 'description', 'mission', 'vision', 'purpose', 'story'],
  ['title', 'description', 'slogan'],
  ['description', 'mission', 'vision', 'purpose', 'story', 'story_continuation', 'leadership_message', 'cta_description']
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return aboutusCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return aboutusCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return aboutusCRUD.delete(params.id)
}