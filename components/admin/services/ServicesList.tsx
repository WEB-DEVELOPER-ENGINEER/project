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
  ReferenceInput,
  SelectInput,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton
} from 'react-admin'

const servicesFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <BooleanInput key="is_active" label="Is Active" source="is_active" />,
  <ReferenceInput key="category_id" source="category_id" reference="service-categories" label="Category">
    <SelectInput optionText="name" />
  </ReferenceInput>,
  <SelectInput key="service_category" label="Service Category (Legacy)" source="service_category" choices={[
    { id: 'Translation', name: 'Translation' },
    { id: 'Legal', name: 'Legal' },
    { id: 'Technical', name: 'Technical' },
    { id: 'Business', name: 'Business' },
    { id: 'Digital', name: 'Digital' },
  ]} />
]

const ServicesListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
)

export const ServicesList = () => (
  <List
    filters={servicesFilters}
    sort={{ field: 'sort_order', order: 'ASC' }}
    perPage={25}
    actions={<ServicesListActions />}
  >
    <Datagrid>
      <NumberField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <TextField source="service_category" label="Category (Legacy)" />
      <TextField source="category_id" label="Category ID" />
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)