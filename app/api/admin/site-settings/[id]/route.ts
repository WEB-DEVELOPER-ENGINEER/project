import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const sitesettingsCRUD = new AdminCRUD(
  'site_settings',
  ['setting_key', 'setting_value', 'setting_type', 'description', 'is_active'],
  ['setting_key', 'setting_value'],
  ['setting_key', 'description'],
  []
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return sitesettingsCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return sitesettingsCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return sitesettingsCRUD.delete(params.id)
}