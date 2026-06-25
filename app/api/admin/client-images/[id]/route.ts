import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'

const clientImagesCRUD = new AdminCRUD(
  'client_images',
  ['client_id', 'image_url', 'alt_text', 'sort_order'],
  ['client_id', 'image_url'],
  ['alt_text'],
  []
)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return clientImagesCRUD.getOne(params.id)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return clientImagesCRUD.update(params.id, request)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return clientImagesCRUD.delete(params.id)
}