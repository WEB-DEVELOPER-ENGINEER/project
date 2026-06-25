import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'

const clientImagesCRUD = new AdminCRUD(
  'client_images',
  ['client_id', 'image_url', 'alt_text', 'sort_order'],
  ['client_id', 'image_url'],
  ['alt_text'],
  []
)

export async function GET(request: NextRequest) {
  return clientImagesCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return clientImagesCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return clientImagesCRUD.deleteMany(request)
}