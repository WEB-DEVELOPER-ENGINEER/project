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

const iconsFilters = [
  <SearchInput key="search" source="q" alwaysOn />
]

export const IconsList = () => (
  <List
    filters={iconsFilters}
    sort={{ field: 'name', order: 'ASC' }}
    perPage={25}
  >
    <Datagrid>
      <NumberField source="id" />
      <TextField source="name" />
      <TextField source="icon_class" />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)