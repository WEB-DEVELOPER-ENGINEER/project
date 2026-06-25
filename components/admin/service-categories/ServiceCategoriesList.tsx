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
  BooleanInput,
  NumberField,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton
} from 'react-admin'

const serviceCategoriesFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <BooleanInput key="is_active" label="Is Active" source="is_active" />
]

const ServiceCategoriesListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
)

export const ServiceCategoriesList = () => (
  <List
    filters={serviceCategoriesFilters}
    sort={{ field: 'sort_order', order: 'ASC' }}
    perPage={25}
    actions={<ServiceCategoriesListActions />}
  >
    <Datagrid>
      <NumberField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="description" />
      <TextField source="icon_name" />
      <TextField source="color" />
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)
