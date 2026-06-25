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

export const FooterSectionsCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <SelectInput source="section_type" choices={[{"id":"main","name":"Main"},{"id":"legal","name":"Legal"},{"id":"social","name":"Social"},{"id":"newsletter","name":"Newsletter"}]} validate={[required()]} />
      <NumberInput source="sort_order" validate={[]} />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Create>
)