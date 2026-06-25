import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const footerlinksCRUD = new AdminCRUD(
  'footer_links',
  ['footer_section_id', 'name', 'url', 'icon_id', 'sort_order', 'is_active'],
  ['footer_section_id', 'name', 'url'],
  ['name'],
  []
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return footerlinksCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return footerlinksCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return footerlinksCRUD.delete(params.id)
}