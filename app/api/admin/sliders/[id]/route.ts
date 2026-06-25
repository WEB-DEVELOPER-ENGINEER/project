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
  ['title', 'description', 'media_type'],
  ['description', 'media_caption']
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return slidersCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return slidersCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return slidersCRUD.delete(params.id)
}