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

export async function GET(request: NextRequest) {
  return footersectionsCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return footersectionsCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return footersectionsCRUD.deleteMany(request)
}