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

export async function GET(request: NextRequest) {
  return featuresCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return featuresCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return featuresCRUD.deleteMany(request)
}