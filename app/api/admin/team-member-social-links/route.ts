import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'

const teamMemberSocialLinksCRUD = new AdminCRUD(
  'team_member_social_links',
  ['team_member_id', 'icon_id', 'url', 'sort_order'],
  ['team_member_id', 'icon_id', 'url'],
  ['url'],
  []
)

export async function GET(request: NextRequest) {
  return teamMemberSocialLinksCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  return teamMemberSocialLinksCRUD.create(request)
}

export async function DELETE(request: NextRequest) {
  return teamMemberSocialLinksCRUD.deleteMany(request)
}