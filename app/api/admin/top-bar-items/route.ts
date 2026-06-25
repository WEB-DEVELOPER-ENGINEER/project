import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const topbaritemsCRUD = new AdminCRUD(
  'top_bar_items',
  ['name', 'link', 'icon_id', 'sort_order', 'is_active'],
  ['name', 'link'],
  ['name'],
  []
)

export async function GET(request: NextRequest) {
  return topbaritemsCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return topbaritemsCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return topbaritemsCRUD.deleteMany(request)
}