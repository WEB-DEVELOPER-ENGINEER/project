import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const iconsCRUD = new AdminCRUD(
  'icons',
  ['name', 'icon_class', 'image_url', 'link'],
  ['name'],
  ['name'],
  []
)

export async function GET(request: NextRequest) {
  return iconsCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return iconsCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return iconsCRUD.deleteMany(request)
}