'use client'

import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  EditButton,
  DeleteButton,
  ImageField,
} from 'react-admin'

export const ClientImagesList = () => (
  <List>
    <Datagrid>
      <NumberField source="id" />
      <ReferenceField source="client_id" reference="clients">
        <TextField source="title" />
      </ReferenceField>
      <ImageField source="image_url" title="alt_text" />
      <TextField source="alt_text" />
      <NumberField source="sort_order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)