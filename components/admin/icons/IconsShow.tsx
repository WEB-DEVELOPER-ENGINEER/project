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

export const IconsShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <TextField source="name" />
      <TextField source="icon_class" />
      <UrlField source="image_url" />
      <UrlField source="link" />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
)