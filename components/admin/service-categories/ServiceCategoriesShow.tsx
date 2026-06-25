'use client'

import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  DateField,
  NumberField,
  RichTextField
} from 'react-admin'

export const ServiceCategoriesShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <RichTextField source="description" />
      <TextField source="icon_name" />
      <TextField source="color" />
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
      <DateField source="updated_at" showTime />
    </SimpleShowLayout>
  </Show>
)
