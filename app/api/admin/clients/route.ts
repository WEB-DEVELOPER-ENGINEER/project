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

export async function GET(request: NextRequest) {
  return clientsCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return clientsCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return clientsCRUD.deleteMany(request)
}