'use client'

import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  EditButton,
  DeleteButton,
} from 'react-admin'

export const CtaBenefitsList = () => (
  <List>
    <Datagrid>
      <NumberField source="id" />
      <ReferenceField source="cta_section_id" reference="cta-sections">
        <TextField source="title" />
      </ReferenceField>
      <TextField source="benefit_text" />
      <TextField source="icon_name" />
      <NumberField source="sort_order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)