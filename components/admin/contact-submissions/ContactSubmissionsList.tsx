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

const contactsubmissionsFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <SelectInput key="status" label="Status" source="status" choices={[{"id":"new","name":"New"},{"id":"in_progress","name":"In Progress"},{"id":"completed","name":"Completed"},{"id":"spam","name":"Spam"}]} />
]

export const ContactSubmissionsList = () => (
  <List
    filters={contactsubmissionsFilters}
    sort={{ field: 'submitted_at', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid>
      <NumberField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="subject" />
      <TextField source="service_type" />
      <TextField source="status" />
      <DateField source="submitted_at" showTime />
      <ShowButton />
    </Datagrid>
  </List>
)