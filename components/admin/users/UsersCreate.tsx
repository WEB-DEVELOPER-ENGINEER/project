'use client'

import {
  Create,
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

export const UsersCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="email" validate={[required(), email()]} />
      <TextInput source="name" validate={[required()]} />
      <PasswordInput source="password" validate={[]} />
      <SelectInput source="role" choices={[{"id":"admin","name":"Admin"},{"id":"super_admin","name":"Super Admin"},{"id":"editor","name":"Editor"}]} validate={[]} />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Create>
)