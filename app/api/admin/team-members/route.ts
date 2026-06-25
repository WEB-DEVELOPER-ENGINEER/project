import { NextRequest } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
const teammembersCRUD = new AdminCRUD(
  'team_members',
  ['name', 'job_title', 'image_url', 'bio', 'sort_order', 'is_active'],
  ['name', 'job_title'],
  ['name', 'job_title'],
  ['bio']
)

export async function GET(request: NextRequest) {
  return teammembersCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return teammembersCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return teammembersCRUD.deleteMany(request)
}