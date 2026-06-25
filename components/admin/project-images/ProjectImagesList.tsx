'use client'

import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  EditButton,
  DeleteButton,
  ImageField,
} from 'react-admin'

export const ProjectImagesList = () => (
  <List>
    <Datagrid>
      <NumberField source="id" />
      <ReferenceField source="project_id" reference="projects">
        <TextField source="title" />
      </ReferenceField>
      <ImageField source="image_url" title="alt_text" />
      <TextField source="alt_text" />
      <TextField source="description" />
      <NumberField source="sort_order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)