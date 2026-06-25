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

export const ClientImagesEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <ReferenceInput source="client_id" reference="clients">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      <ImageUploadInput 
        source="image_url" 
        label="Client Logo" 
        helperText="Client logo image (recommended: 300x150px for optimal display)"
        showMetadata={true}
        validate={[required()]}
      />
      <TextInput source="alt_text" validate={[]} />
      <NumberInput source="sort_order" defaultValue={0} />
    </SimpleForm>
  </Edit>
)