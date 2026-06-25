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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return teammembersCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return teammembersCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return teammembersCRUD.delete(params.id)
}