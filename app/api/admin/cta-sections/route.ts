import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const ctasectionsCRUD = new AdminCRUD(
  'cta_sections',
  ['title', 'description', 'primary_button_text', 'primary_button_url', 'secondary_button_text', 'secondary_button_url', 'background_type', 'background_value', 'section_location', 'sort_order', 'is_active'],
  ['title'],
  ['title', 'section_location'],
  ['description']
)

export async function GET(request: NextRequest) {
  return ctasectionsCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return ctasectionsCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return ctasectionsCRUD.deleteMany(request)
}