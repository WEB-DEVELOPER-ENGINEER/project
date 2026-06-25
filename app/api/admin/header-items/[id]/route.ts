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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return headeritemsCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return headeritemsCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return headeritemsCRUD.delete(params.id)
}