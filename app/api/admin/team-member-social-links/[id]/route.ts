import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'

const teamMemberSocialLinksCRUD = new AdminCRUD(
  'team_member_social_links',
  ['team_member_id', 'icon_id', 'url', 'sort_order'],
  ['team_member_id', 'icon_id', 'url'],
  ['url'],
  []
)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return teamMemberSocialLinksCRUD.getOne(params.id)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return teamMemberSocialLinksCRUD.update(params.id, request)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return teamMemberSocialLinksCRUD.delete(params.id)
}