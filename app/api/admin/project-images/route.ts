import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'

const projectImagesCRUD = new AdminCRUD(
  'project_images',
  ['project_id', 'image_url', 'description', 'alt_text', 'sort_order'],
  ['project_id', 'image_url'],
  ['alt_text', 'description'],
  ['description']
)

export async function GET(request: NextRequest) {
  return projectImagesCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return projectImagesCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return projectImagesCRUD.deleteMany(request)
}