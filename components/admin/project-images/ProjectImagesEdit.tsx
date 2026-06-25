'use client'

import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  required,
} from 'react-admin'
import { ImageUploadInput } from '../ImageUploadInput'
import { CKEditorInput } from '../CKEditorInput'

export const ProjectImagesEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <ReferenceInput source="project_id" reference="projects">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      <ImageUploadInput 
        source="image_url" 
        label="Project Image" 
        helperText="Project gallery image (recommended: 800x600px for optimal display)"
        showMetadata={true}
        validate={[required()]}
      />
      <CKEditorInput source="description" validate={[]} />
      <TextInput source="alt_text" validate={[]} />
      <NumberInput source="sort_order" defaultValue={0} />
    </SimpleForm>
  </Edit>
)