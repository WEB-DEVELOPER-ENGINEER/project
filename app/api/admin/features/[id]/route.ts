import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const featuresCRUD = new AdminCRUD(
  'features',
  ['title', 'description', 'icon_name', 'icon_color', 'category', 'sort_order', 'is_active'],
  ['title', 'description'],
  ['title', 'description', 'category'],
  ['description']
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return featuresCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return featuresCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return featuresCRUD.delete(params.id)
}