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

export const FeaturesEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" validate={[]} />
      <TextInput source="title" validate={[required()]} />
      <CKEditorInput source="description" validate={[required()]} />
      <TextInput source="icon_name" validate={[]} />
      <TextInput source="icon_color" validate={[]} />
      <TextInput source="category" validate={[]} />
      <NumberInput source="sort_order" validate={[]} />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Edit>
)