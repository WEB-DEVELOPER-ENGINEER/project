import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const seometadataCRUD = new AdminCRUD(
  'seo_metadata',
  ['page_type', 'page_id', 'meta_title', 'meta_description', 'canonical_url', 'og_title', 'og_description', 'og_image', 'twitter_title', 'twitter_description', 'twitter_image', 'schema_markup'],
  ['page_type'],
  ['page_type', 'meta_title'],
  []
)

export async function GET(request: NextRequest) {
  return seometadataCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return seometadataCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return seometadataCRUD.deleteMany(request)
}