'use client'

import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  DateField,
  TopToolbar,
  EditButton,
  DeleteButton,
  ChipField,
} from 'react-admin'

const BlogCategoriesShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
)

export const BlogCategoriesShow = () => (
  <Show actions={<BlogCategoriesShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="description" />
      
      <ChipField source="color" label="Color Theme" />
      <TextField source="icon_name" label="Icon Name" />
      
      <TextField source="sort_order" label="Sort Order" />
      <BooleanField source="is_active" label="Active" />
      
      <DateField source="created_at" label="Created" showTime />
      <DateField source="updated_at" label="Last Updated" showTime />
    </SimpleShowLayout>
  </Show>
)