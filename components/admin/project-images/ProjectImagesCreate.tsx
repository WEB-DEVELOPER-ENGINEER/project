'use client'

import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  required,
} from 'react-admin'
import { ImageUploadInput } from '../ImageUploadInput'
import { CKEditorInput } from '../CKEditorInput'

export const ProjectImagesCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="project_id" reference="projects">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      <ImageUploadInput 
        source="image_url" 
        label="Project Image" 
        helperText="Upload high-quality project image (recommended: 1920x1080px)"
        validate={[required()]}
        showMetadata={true}
      />
      <CKEditorInput source="description" validate={[]} />
      <TextInput source="alt_text" validate={[]} />
      <NumberInput source="sort_order" defaultValue={0} />
    </SimpleForm>
  </Create>
)