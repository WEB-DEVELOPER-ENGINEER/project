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

export const TestimonialsShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <TextField source="name" />
      <RichTextField source="description" />
      <TextField source="company" />
      <TextField source="position" />
      <UrlField source="image_url" />
      <NumberField source="rating" />
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
)