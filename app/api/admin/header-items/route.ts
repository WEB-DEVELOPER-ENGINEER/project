import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const headeritemsCRUD = new AdminCRUD(
  'header_items',
  ['name', 'link', 'sort_order', 'is_active'],
  ['name'],
  ['name'],
  []
)

export async function GET(request: NextRequest) {
  return headeritemsCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return headeritemsCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return headeritemsCRUD.deleteMany(request)
}