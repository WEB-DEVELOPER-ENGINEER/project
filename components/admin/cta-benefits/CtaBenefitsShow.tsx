'use client'

import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  ReferenceField,
  DateField,
} from 'react-admin'

export const CtaBenefitsShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <ReferenceField source="cta_section_id" reference="cta-sections">
        <TextField source="title" />
      </ReferenceField>
      <TextField source="benefit_text" />
      <TextField source="icon_name" />
      <NumberField source="sort_order" />
      <DateField source="created_at" />
    </SimpleShowLayout>
  </Show>
)