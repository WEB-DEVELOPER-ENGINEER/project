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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return testimonialsCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return testimonialsCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return testimonialsCRUD.delete(params.id)
}