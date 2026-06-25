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
  FilterButton,
  TopToolbar,
  CreateButton,
  ExportButton,
} from 'react-admin'

const postFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <TextInput key="title" label="Title" source="title" />,
  <BooleanInput key="published" label="Published" source="is_published" />,
]

export const PostList = () => (
  <List
    filters={postFilters}
    sort={{ field: 'created_at', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <TextField source="author" />
      <DateField source="published_date" />
      <BooleanField source="is_published" />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)