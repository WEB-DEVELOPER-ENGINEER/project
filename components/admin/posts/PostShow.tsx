'use client'

import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  BooleanField,
  RichTextField,
  TopToolbar,
  EditButton,
  DeleteButton,
} from 'react-admin'

const PostShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
)

export const PostShow = () => (
  <Show actions={<PostShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <TextField source="description" />
      <RichTextField source="content" />
      <TextField source="image_url" label="Featured Image URL" />
      <TextField source="author" />
      <DateField source="published_date" />
      <BooleanField source="is_published" />
      <TextField source="meta_title" label="SEO Title" />
      <TextField source="meta_description" label="SEO Description" />
      <DateField source="created_at" showTime />
      <DateField source="updated_at" showTime />
    </SimpleShowLayout>
  </Show>
)