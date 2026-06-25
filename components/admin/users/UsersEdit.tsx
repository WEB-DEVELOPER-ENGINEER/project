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

export const UsersEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" validate={[]} />
      <TextInput source="email" validate={[required(), email()]} />
      <TextInput source="name" validate={[required()]} />
      <SelectInput source="role" choices={[{"id":"admin","name":"Admin"},{"id":"super_admin","name":"Super Admin"},{"id":"editor","name":"Editor"}]} validate={[]} />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Edit>
)