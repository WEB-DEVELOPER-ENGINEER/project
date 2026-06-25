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

export const FooterLinksEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" validate={[]} />
      <NumberInput source="footer_section_id" validate={[required()]} />
      <TextInput source="name" validate={[required()]} />
      <TextInput source="url" validate={[required()]} />
      <NumberInput source="icon_id" validate={[]} />
      <NumberInput source="sort_order" validate={[]} />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Edit>
)