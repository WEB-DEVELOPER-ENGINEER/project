'use client'

import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  required,
} from 'react-admin'

export const TeamMemberSocialLinksEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <ReferenceInput source="team_member_id" reference="team-members">
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>
      <ReferenceInput source="icon_id" reference="icons">
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>
      <TextInput source="url" validate={[required()]} />
      <NumberInput source="sort_order" defaultValue={0} />
    </SimpleForm>
  </Edit>
)