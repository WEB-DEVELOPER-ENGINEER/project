import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'

const serviceCategoriesCRUD = new AdminCRUD(
  'service_categories',
  ['name', 'slug', 'description', 'icon_name', 'color', 'sort_order', 'is_active'],
  ['name', 'slug'],
  ['name', 'description'],
  ['description']
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return serviceCategoriesCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return serviceCategoriesCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return serviceCategoriesCRUD.delete(params.id)
}
