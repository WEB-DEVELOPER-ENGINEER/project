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
import { ImageUploadInput } from '../ImageUploadInput'
import { CKEditorInput } from '../CKEditorInput'

export const IconsEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" validate={[]} />
      <TextInput source="name" validate={[required()]} />
      <TextInput source="icon_class" validate={[]} />
      <ImageUploadInput 
        source="image_url" 
        label="Icon Image" 
        helperText="Icon image (recommended: 64x64px SVG or PNG for optimal display)"
        showMetadata={true}
      />
      <TextInput source="link" validate={[]} />
    </SimpleForm>
  </Edit>
)