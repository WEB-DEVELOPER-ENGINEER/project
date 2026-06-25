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

const footerlinksFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <BooleanInput key="is_active" label="Is Active" source="is_active" />
]

export const FooterLinksList = () => (
  <List
    filters={footerlinksFilters}
    sort={{ field: 'sort_order', order: 'ASC' }}
    perPage={25}
  >
    <Datagrid>
      <NumberField source="id" />
      <NumberField source="footer_section_id" />
      <TextField source="name" />
      <UrlField source="url" />
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)