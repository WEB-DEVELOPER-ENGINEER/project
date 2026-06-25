import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'

const ctaBenefitsCRUD = new AdminCRUD(
  'cta_benefits',
  ['cta_section_id', 'benefit_text', 'icon_name', 'sort_order'],
  ['cta_section_id', 'benefit_text'],
  ['benefit_text'],
  []
)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return ctaBenefitsCRUD.getOne(params.id)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return ctaBenefitsCRUD.update(params.id, request)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return ctaBenefitsCRUD.delete(params.id)
}