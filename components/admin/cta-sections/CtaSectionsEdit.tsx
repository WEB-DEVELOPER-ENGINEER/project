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

export const CtaSectionsEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" validate={[]} />
      <TextInput source="title" validate={[required()]} />
      <CKEditorInput source="description" validate={[]} />
      <TextInput source="primary_button_text" validate={[]} />
      <TextInput source="primary_button_url" validate={[]} />
      <TextInput source="secondary_button_text" validate={[]} />
      <TextInput source="secondary_button_url" validate={[]} />
      <SelectInput source="background_type" choices={[{"id":"gradient","name":"Gradient"},{"id":"image","name":"Image"},{"id":"solid","name":"Solid"}]} validate={[]} />
      <TextInput source="background_value" validate={[]} />
      <TextInput source="section_location" validate={[]} />
      <NumberInput source="sort_order" validate={[]} />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Edit>
)