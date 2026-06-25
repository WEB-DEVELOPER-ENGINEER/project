'use client'

import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  required,
} from 'react-admin'
import { ImageUploadInput } from '../ImageUploadInput'

export const BlogAuthorsCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} fullWidth />
      <TextInput source="slug" validate={[required()]} fullWidth helperText="URL-friendly version of name" />
      <TextInput source="title" fullWidth helperText="e.g., Senior Legal Translation Specialist" />
      <TextInput source="bio" multiline rows={4} fullWidth />
      <ImageUploadInput 
        source="image_url" 
        label="Author Photo" 
        helperText="Upload author profile photo (recommended: 400x400px)"
        showMetadata={true}
      />
      <TextInput source="email" type="email" fullWidth />
      
      <ArrayInput source="expertise" label="Areas of Expertise">
        <SimpleFormIterator>
          <TextInput source="." label="Expertise Area" />
        </SimpleFormIterator>
      </ArrayInput>
      
      <ArrayInput source="achievements" label="Achievements">
        <SimpleFormIterator>
          <TextInput source="." label="Achievement" />
        </SimpleFormIterator>
      </ArrayInput>
      
      <TextInput source="social_links.linkedin" label="LinkedIn URL" fullWidth />
      <TextInput source="social_links.twitter" label="Twitter URL" fullWidth />
      <TextInput source="social_links.email" label="Contact Email" fullWidth />
      <TextInput source="social_links.website" label="Personal Website" fullWidth />
      
      <NumberInput source="sort_order" defaultValue={0} />
      <BooleanInput source="is_active" defaultValue={true} />
    </SimpleForm>
  </Create>
)