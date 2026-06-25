'use client'

import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  required,
} from 'react-admin'

const colorChoices = [
  { id: 'bg-blue-100 text-blue-800', name: 'Blue' },
  { id: 'bg-green-100 text-green-800', name: 'Green' },
  { id: 'bg-purple-100 text-purple-800', name: 'Purple' },
  { id: 'bg-red-100 text-red-800', name: 'Red' },
  { id: 'bg-yellow-100 text-yellow-800', name: 'Yellow' },
  { id: 'bg-orange-100 text-orange-800', name: 'Orange' },
  { id: 'bg-gray-100 text-gray-800', name: 'Gray' },
  { id: 'bg-pink-100 text-pink-800', name: 'Pink' },
  { id: 'bg-indigo-100 text-indigo-800', name: 'Indigo' },
]

const iconChoices = [
  { id: 'Scale', name: 'Scale (Legal)' },
  { id: 'Code', name: 'Code (Technical)' },
  { id: 'Briefcase', name: 'Briefcase (Business)' },
  { id: 'Heart', name: 'Heart (Medical)' },
  { id: 'GraduationCap', name: 'Graduation Cap (Academic)' },
  { id: 'TrendingUp', name: 'Trending Up (Insights)' },
  { id: 'FileText', name: 'File Text (General)' },
  { id: 'Globe', name: 'Globe (International)' },
  { id: 'Users', name: 'Users (Team)' },
  { id: 'Star', name: 'Star (Featured)' },
]

export const BlogCategoriesCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} fullWidth />
      <TextInput source="slug" validate={[required()]} fullWidth helperText="URL-friendly version of name" />
      <TextInput source="description" multiline rows={3} fullWidth />
      
      <SelectInput source="color" label="Color Theme" choices={colorChoices} fullWidth />
      <SelectInput source="icon_name" label="Icon" choices={iconChoices} fullWidth />
      
      <NumberInput source="sort_order" defaultValue={0} />
      <BooleanInput source="is_active" defaultValue={true} />
    </SimpleForm>
  </Create>
)