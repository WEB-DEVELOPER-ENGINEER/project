'use client'

import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  EditButton,
  ShowButton,
  DeleteButton,
  SearchInput,
  TextInput,
  BooleanInput,
  SelectInput,
  FilterButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  EmailField,
  UrlField,
  NumberField,
} from 'react-admin'

const blogpostsFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <BooleanInput key="is_published" label="Is Published" source="is_published" />
]

export const BlogPostsList = () => (
  <List
    filters={blogpostsFilters}
    sort={{ field: 'published_date', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid>
      <NumberField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <TextField source="author" />
      <DateField source="published_date" showTime />
      <BooleanField source="is_published" />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)