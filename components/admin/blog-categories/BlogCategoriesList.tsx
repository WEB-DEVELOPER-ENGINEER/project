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
  ChipField,
} from 'react-admin'

const blogCategoryFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <TextInput key="name" label="Name" source="name" />,
  <BooleanInput key="active" label="Active" source="is_active" />,
]

export const BlogCategoriesList = () => (
  <List
    filters={blogCategoryFilters}
    sort={{ field: 'sort_order', order: 'ASC' }}
    perPage={25}
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <ChipField source="color" />
      <TextField source="icon_name" />
      <TextField source="description" />
      <BooleanField source="is_active" />
      <TextField source="sort_order" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)