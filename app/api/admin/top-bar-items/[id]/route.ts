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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return topbaritemsCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return topbaritemsCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return topbaritemsCRUD.delete(params.id)
}