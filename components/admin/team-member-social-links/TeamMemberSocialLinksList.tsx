'use client'

import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  EditButton,
  DeleteButton,
  UrlField,
} from 'react-admin'

export const TeamMemberSocialLinksList = () => (
  <List>
    <Datagrid>
      <NumberField source="id" />
      <ReferenceField source="team_member_id" reference="team-members">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="icon_id" reference="icons">
        <TextField source="name" />
      </ReferenceField>
      <UrlField source="url" />
      <NumberField source="sort_order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)