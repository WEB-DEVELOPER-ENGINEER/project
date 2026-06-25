import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const slidersCRUD = new AdminCRUD(
  'sliders',
  [
    'title', 
    'description', 
    'media_type',
    'image_url', 
    'video_url',
    'video_thumbnail_url',
    'video_platform',
    'video_embed_id',
    'video_quality',
    'video_start_time',
    'video_end_time',
    'video_privacy_mode',
    'video_duration',
    'video_autoplay',
    'video_muted',
    'video_loop',
    'media_alt_text',
    'media_caption',
    'lazy_loading',
    'responsive_breakpoints',
    'seo_metadata',
    'sort_order', 
    'is_active'
  ],
  ['title', 'description', 'media_alt_text', 'media_caption'],
  ['title', 'description', 'media_type', 'video_platform'],
  ['description', 'media_caption']
)

export async function GET(request: NextRequest) {
  return slidersCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return slidersCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return slidersCRUD.deleteMany(request)
}