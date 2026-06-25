import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'

const ctaBenefitsCRUD = new AdminCRUD(
  'cta_benefits',
  ['cta_section_id', 'benefit_text', 'icon_name', 'sort_order'],
  ['cta_section_id', 'benefit_text'],
  ['benefit_text'],
  []
)

export async function GET(request: NextRequest) {
  return ctaBenefitsCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return ctaBenefitsCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return ctaBenefitsCRUD.deleteMany(request)
}