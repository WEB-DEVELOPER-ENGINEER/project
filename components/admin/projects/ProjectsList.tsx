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
  RichTextField,
  ImageField,
  FunctionField,
} from 'react-admin'

const projectsFilters = [
  <SearchInput key="search" source="q" alwaysOn />,
  <BooleanInput key="is_active" label="Is Active" source="is_active" />
]

const ProjectsListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
)

export const ProjectsList = () => (
  <List
    filters={projectsFilters}
    sort={{ field: 'sort_order', order: 'ASC' }}
    perPage={25}
    actions={<ProjectsListActions />}
  >
    <Datagrid>
      <NumberField source="id" />
      <TextField source="title" />
      <FunctionField 
        label="Description" 
        render={(record: any) => 
          record.description ? record.description.substring(0, 100) + '...' : ''
        } 
      />
      <TextField source="slug" />
      <NumberField source="sort_order" />
      <FunctionField 
        label="Images" 
        render={(record: any) => 
          record.images ? `${record.images.length} image(s)` : '0 images'
        } 
      />
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)