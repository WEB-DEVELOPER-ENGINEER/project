'use client'

import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  ReferenceField,
  UrlField,
} from 'react-admin'

export const TeamMemberSocialLinksShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <ReferenceField source="team_member_id" reference="team-members">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="icon_id" reference="icons">
        <TextField source="name" />
      </ReferenceField>
      <UrlField source="url" />
      <NumberField source="sort_order" />
    </SimpleShowLayout>
  </Show>
)