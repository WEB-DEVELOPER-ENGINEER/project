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
  ImageField,
  FunctionField,
} from 'react-admin'

const aboutusFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <BooleanInput key="is_active" label="Is Active" source="is_active" />
]

export const AboutUsList = () => (
  <List
    filters={aboutusFilters}
    sort={{ field: 'created_at', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid>
      <NumberField source="id" />
      <TextField source="title" />
      <TextField source="slogan" />
      <FunctionField 
        label="Hero Image" 
        render={(record: any) => record.hero_image_url ? '✓' : '—'} 
      />
      <FunctionField 
        label="Mission" 
        render={(record: any) => record.mission ? '✓' : '—'} 
      />
      <FunctionField 
        label="Values" 
        render={(record: any) => {
          if (!record.values) return '—';
          try {
            const values = JSON.parse(record.values);
            return Array.isArray(values) ? `${values.length} items` : '—';
          } catch (e) {
            return '—';
          }
        }} 
      />
      <FunctionField 
        label="Timeline" 
        render={(record: any) => {
          if (!record.timeline_phases) return '—';
          try {
            const phases = JSON.parse(record.timeline_phases);
            return Array.isArray(phases) ? `${phases.length} phases` : '—';
          } catch (e) {
            return '—';
          }
        }} 
      />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)