import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const testimonialsCRUD = new AdminCRUD(
  'testimonials',
  ['name', 'description', 'company', 'position', 'image_url', 'rating', 'sort_order', 'is_active'],
  ['name', 'description'],
  ['name', 'description', 'company'],
  ['description']
)

export async function GET(request: NextRequest) {
  return testimonialsCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return testimonialsCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return testimonialsCRUD.deleteMany(request)
}