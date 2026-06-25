import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'
const contactsubmissionsCRUD = new AdminCRUD(
  'contact_submissions',
  ['name', 'email', 'subject', 'message', 'phone', 'service_type', 'status'],
  ['name', 'email', 'message'],
  ['name', 'email', 'subject', 'message'],
  []
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return contactsubmissionsCRUD.getOne(params.id)
}