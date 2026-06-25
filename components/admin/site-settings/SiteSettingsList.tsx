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

const sitesettingsFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <BooleanInput key="is_active" label="Is Active" source="is_active" />,
  <SelectInput key="setting_type" label="Setting Type" source="setting_type" choices={[{"id":"text","name":"Text"},{"id":"json","name":"JSON"},{"id":"boolean","name":"Boolean"},{"id":"number","name":"Number"}]} />
]

export const SiteSettingsList = () => (
  <List
    filters={sitesettingsFilters}
    sort={{ field: 'setting_key', order: 'ASC' }}
    perPage={25}
  >
    <Datagrid>
      <NumberField source="id" />
      <TextField source="setting_key" />
      <TextField source="setting_type" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)