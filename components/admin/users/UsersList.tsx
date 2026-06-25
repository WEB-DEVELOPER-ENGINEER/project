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

const usersFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <BooleanInput key="is_active" label="Is Active" source="is_active" />,
  <SelectInput key="role" label="Role" source="role" choices={[{"id":"admin","name":"Admin"},{"id":"super_admin","name":"Super Admin"},{"id":"editor","name":"Editor"}]} />
]

export const UsersList = () => (
  <List
    filters={usersFilters}
    sort={{ field: 'created_at', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid>
      <NumberField source="id" />
      <EmailField source="email" />
      <TextField source="name" />
      <TextField source="role" />
      <BooleanField source="is_active" />
      <DateField source="last_login" showTime />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)