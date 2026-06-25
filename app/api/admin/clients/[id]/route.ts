import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const clientsCRUD = new AdminCRUD(
  'clients',
  ['title', 'description', 'sort_order', 'is_active'],
  ['title', 'description'],
  ['title', 'description'],
  ['description']
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return clientsCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return clientsCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return clientsCRUD.delete(params.id)
}