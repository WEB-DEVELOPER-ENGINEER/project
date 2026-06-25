'use client'

import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  BooleanField,
  EmailField,
  UrlField,
  NumberField,
  RichTextField,
} from 'react-admin'

export const ServicesShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <TextField source="title" />
      <RichTextField source="content" />
      <NumberField source="icon_id" />
      <TextField source="slug" />
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
)