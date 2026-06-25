'use client'

import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  ReferenceField,
  ImageField,
  DateField,
} from 'react-admin'

export const ClientImagesShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <ReferenceField source="client_id" reference="clients">
        <TextField source="title" />
      </ReferenceField>
      <ImageField source="image_url" title="alt_text" />
      <TextField source="alt_text" />
      <NumberField source="sort_order" />
      <DateField source="created_at" />
    </SimpleShowLayout>
  </Show>
)