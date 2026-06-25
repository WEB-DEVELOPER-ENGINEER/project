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

export const SeoMetadataShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <TextField source="page_type" />
      <NumberField source="page_id" />
      <TextField source="meta_title" />
      <TextField source="meta_description" />
      <UrlField source="canonical_url" />
      <TextField source="og_title" />
      <TextField source="og_description" />
      <UrlField source="og_image" />
      <TextField source="twitter_title" />
      <TextField source="twitter_description" />
      <UrlField source="twitter_image" />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
)