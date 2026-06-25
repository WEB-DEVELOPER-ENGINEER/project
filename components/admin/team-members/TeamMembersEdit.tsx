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

export const TeamMembersEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" validate={[]} />
      <TextInput source="name" validate={[required()]} />
      <TextInput source="job_title" validate={[required()]} />
      <ImageUploadInput 
        source="image_url" 
        label="Profile Image" 
        helperText="Team member profile photo (recommended: 400x400px for optimal display)"
        showMetadata={true}
      />
      <CKEditorInput source="bio" validate={[]} />
      <NumberInput source="sort_order" validate={[]} />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Edit>
)