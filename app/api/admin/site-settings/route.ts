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

export async function GET(request: NextRequest) {
  return sitesettingsCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return sitesettingsCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return sitesettingsCRUD.deleteMany(request)
}