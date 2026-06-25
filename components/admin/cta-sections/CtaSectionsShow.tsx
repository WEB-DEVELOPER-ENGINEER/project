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

export const CtaSectionsShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <TextField source="title" />
      <RichTextField source="description" />
      <TextField source="primary_button_text" />
      <UrlField source="primary_button_url" />
      <TextField source="secondary_button_text" />
      <UrlField source="secondary_button_url" />
      <TextField source="background_type" />
      <TextField source="background_value" />
      <TextField source="section_location" />
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
)