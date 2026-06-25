import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const footersectionsCRUD = new AdminCRUD(
  'footer_sections',
  ['title', 'section_type', 'sort_order', 'is_active'],
  ['title', 'section_type'],
  ['title'],
  []
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return footersectionsCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return footersectionsCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return footersectionsCRUD.delete(params.id)
}