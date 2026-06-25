'use client'

import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  DateField,
  TopToolbar,
  EditButton,
  DeleteButton,
  ChipField,
} from 'react-admin'

const CompanyMetricsShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
)

export const CompanyMetricsShow = () => (
  <Show actions={<CompanyMetricsShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="metric_key" label="Metric Key" />
      <TextField source="metric_value" label="Display Value" />
      <TextField source="metric_label" label="Display Label" />
      <TextField source="metric_description" label="Description" />
      
      <ChipField source="category" label="Category" />
      
      <TextField source="icon_name" label="Icon Name" />
      <TextField source="color_class" label="Color Class" />
      
      <TextField source="display_order" label="Display Order" />
      <BooleanField source="is_active" label="Active" />
      
      <DateField source="created_at" label="Created" showTime />
      <DateField source="updated_at" label="Last Updated" showTime />
    </SimpleShowLayout>
  </Show>
)