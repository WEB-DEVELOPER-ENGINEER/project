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

export const BlogPostsShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <RichTextField source="description" />
      <RichTextField source="content" />
      <UrlField source="image_url" />
      <TextField source="author" />
      <DateField source="published_date" showTime />
      <BooleanField source="is_published" />
      <TextField source="meta_title" />
      <TextField source="meta_description" />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
)