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

export const FeaturesShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <TextField source="title" />
      <RichTextField source="description" />
      <TextField source="icon_name" />
      <TextField source="icon_color" />
      <TextField source="category" />
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
)