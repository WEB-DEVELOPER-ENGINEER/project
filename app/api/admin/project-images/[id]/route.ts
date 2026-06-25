import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'

const projectImagesCRUD = new AdminCRUD(
  'project_images',
  ['project_id', 'image_url', 'description', 'alt_text', 'sort_order'],
  ['project_id', 'image_url'],
  ['alt_text', 'description'],
  ['description']
)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return projectImagesCRUD.getOne(params.id)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return projectImagesCRUD.update(params.id, request)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return projectImagesCRUD.delete(params.id)
}