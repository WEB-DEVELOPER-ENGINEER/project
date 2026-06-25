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

export const FooterLinksShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <NumberField source="footer_section_id" />
      <TextField source="name" />
      <UrlField source="url" />
      <NumberField source="icon_id" />
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
)