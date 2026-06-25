'use client'

import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  EditButton,
  ShowButton,
  DeleteButton,
  SearchInput,
  TextInput,
  BooleanInput,
  TopToolbar,
  CreateButton,
  ExportButton,
  ImageField,
  ArrayField,
  SingleFieldList,
  ChipField,
} from 'react-admin'

const blogAuthorFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <TextInput key="name" label="Name" source="name" />,
  <BooleanInput key="active" label="Active" source="is_active" />,
]

export const BlogAuthorsList = () => (
  <List
    filters={blogAuthorFilters}
    sort={{ field: 'sort_order', order: 'ASC' }}
    perPage={25}
  >
    <Datagrid>
      <TextField source="id" />
      <ImageField source="image_url" label="Photo" />
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="title" />
      <ArrayField source="expertise">
        <SingleFieldList>
          <ChipField source="." />
        </SingleFieldList>
      </ArrayField>
      <BooleanField source="is_active" />
      <TextField source="sort_order" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)