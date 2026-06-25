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

export async function GET(request: NextRequest) {
  return footerlinksCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return footerlinksCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return footerlinksCRUD.deleteMany(request)
}