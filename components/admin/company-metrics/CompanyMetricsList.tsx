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
  SelectInput,
  TopToolbar,
  CreateButton,
  ExportButton,
} from 'react-admin'

const companyMetricFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <TextInput key="key" label="Metric Key" source="metric_key" />,
  <SelectInput key="category" label="Category" source="category" choices={[
    { id: 'stats', name: 'Statistics' },
    { id: 'achievements', name: 'Achievements' },
    { id: 'certifications', name: 'Certifications' },
    { id: 'benefits', name: 'Benefits' },
  ]} />,
  <BooleanInput key="active" label="Active" source="is_active" />,
]

export const CompanyMetricsList = () => (
  <List
    filters={companyMetricFilters}
    sort={{ field: 'display_order', order: 'ASC' }}
    perPage={25}
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="metric_key" />
      <TextField source="metric_value" />
      <TextField source="metric_label" />
      <TextField source="category" />
      <TextField source="icon_name" />
      <TextField source="color_class" />
      <BooleanField source="is_active" />
      <TextField source="display_order" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)