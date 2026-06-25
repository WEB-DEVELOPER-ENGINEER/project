'use client'

import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  ImageInput,
  ImageField,
  required,
} from 'react-admin'
import { CKEditorInput } from '../CKEditorInput'

export const ClientsCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <CKEditorInput source="description" validate={[required()]} />
      <NumberInput source="sort_order" validate={[]} />
      <BooleanInput source="is_active" />
      <ImageInput source="client_images" label="Client Images" accept={"image/*" as any} multiple>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
)