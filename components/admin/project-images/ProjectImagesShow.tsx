'use client'

import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  ReferenceField,
  ImageField,
  DateField,
  RichTextField,
} from 'react-admin'

export const ProjectImagesShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <ReferenceField source="project_id" reference="projects">
        <TextField source="title" />
      </ReferenceField>
      <ImageField source="image_url" title="alt_text" />
      <RichTextField source="description" />
      <TextField source="alt_text" />
      <NumberField source="sort_order" />
      <DateField source="created_at" />
    </SimpleShowLayout>
  </Show>
)