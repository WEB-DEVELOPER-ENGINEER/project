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

const featuresFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <BooleanInput key="is_active" label="Is Active" source="is_active" />
]

export const FeaturesList = () => (
  <List
    filters={featuresFilters}
    sort={{ field: 'sort_order', order: 'ASC' }}
    perPage={25}
  >
    <Datagrid>
      <NumberField source="id" />
      <TextField source="title" />
      <TextField source="icon_name" />
      <TextField source="category" />
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)