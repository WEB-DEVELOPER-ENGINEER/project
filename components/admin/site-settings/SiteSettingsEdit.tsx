'use client'

import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  required,
  email,
  PasswordInput,
} from 'react-admin'
import { CKEditorInput } from '../CKEditorInput'

export const SiteSettingsEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" validate={[]} />
      <TextInput source="setting_key" validate={[required()]} />
      <TextInput source="setting_value" validate={[required()]} />
      <SelectInput source="setting_type" choices={[{"id":"text","name":"Text"},{"id":"json","name":"JSON"},{"id":"boolean","name":"Boolean"},{"id":"number","name":"Number"}]} validate={[]} />
      <TextInput source="description" validate={[]} />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Edit>
)