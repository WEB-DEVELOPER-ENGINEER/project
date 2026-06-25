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

const slidersFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <BooleanInput key="is_active" label="Is Active" source="is_active" />,
  <SelectInput 
    key="media_type" 
    label="Media Type" 
    source="media_type" 
    choices={[
      { id: 'image', name: 'Image' },
      { id: 'video', name: 'Video' },
    ]}
    alwaysOn={false}
  />
]

export const SlidersList = () => (
  <List
    filters={slidersFilters}
    sort={{ field: 'sort_order', order: 'ASC' }}
    perPage={25}
  >
    <Datagrid>
      <NumberField source="id" />
      <TextField source="title" />
      <TextField source="media_type" label="Media Type" />
      <NumberField source="sort_order" />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)