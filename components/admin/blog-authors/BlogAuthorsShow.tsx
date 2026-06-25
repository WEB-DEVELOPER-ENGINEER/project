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
  ImageField,
  ArrayField,
  SingleFieldList,
  ChipField,
  EmailField,
  UrlField,
} from 'react-admin'

const BlogAuthorsShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
)

export const BlogAuthorsShow = () => (
  <Show actions={<BlogAuthorsShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ImageField source="image_url" label="Photo" />
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="title" />
      <TextField source="bio" />
      <EmailField source="email" />
      
      <ArrayField source="expertise" label="Areas of Expertise">
        <SingleFieldList>
          <ChipField source="." />
        </SingleFieldList>
      </ArrayField>
      
      <ArrayField source="achievements" label="Achievements">
        <SingleFieldList>
          <ChipField source="." />
        </SingleFieldList>
      </ArrayField>
      
      <UrlField source="social_links.linkedin" label="LinkedIn" />
      <UrlField source="social_links.twitter" label="Twitter" />
      <EmailField source="social_links.email" label="Contact Email" />
      <UrlField source="social_links.website" label="Website" />
      
      <TextField source="sort_order" label="Sort Order" />
      <BooleanField source="is_active" label="Active" />
      
      <DateField source="created_at" label="Created" showTime />
      <DateField source="updated_at" label="Last Updated" showTime />
    </SimpleShowLayout>
  </Show>
)