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
import { ImageUploadInput } from '../ImageUploadInput'

export const TestimonialsEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" validate={[]} />
      <TextInput source="name" validate={[required()]} />
      <CKEditorInput source="description" validate={[required()]} />
      <TextInput source="company" validate={[]} />
      <TextInput source="position" validate={[]} />
      <ImageUploadInput 
        source="image_url" 
        label="Customer Photo" 
        helperText="Customer profile photo (recommended: 200x200px for optimal display)"
        showMetadata={true}
      />
      <NumberInput source="rating" validate={[]} />
      <NumberInput source="sort_order" validate={[]} />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Edit>
)