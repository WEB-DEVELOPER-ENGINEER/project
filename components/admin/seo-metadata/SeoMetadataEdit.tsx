'use client'

import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  required,
  maxLength,
} from 'react-admin'

export const SeoMetadataEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <SelectInput 
        source="page_type" 
        validate={[required()]} 
        choices={[
          { id: 'blog', name: 'Blog Post' },
          { id: 'service', name: 'Service' },
          { id: 'project', name: 'Project' },
          { id: 'page', name: 'Static Page' },
        ]}
      />
      <NumberInput source="page_id" validate={[]} />
      <TextInput source="meta_title" validate={[maxLength(60)]} helperText="Max 60 characters" />
      <TextInput source="meta_description" validate={[maxLength(160)]} helperText="Max 160 characters" multiline />
      <TextInput source="canonical_url" validate={[]} />
      <TextInput source="og_title" validate={[maxLength(60)]} helperText="Max 60 characters" />
      <TextInput source="og_description" validate={[maxLength(160)]} helperText="Max 160 characters" multiline />
      <TextInput source="og_image" validate={[]} />
      <TextInput source="twitter_title" validate={[maxLength(60)]} helperText="Max 60 characters" />
      <TextInput source="twitter_description" validate={[maxLength(160)]} helperText="Max 160 characters" multiline />
      <TextInput source="twitter_image" validate={[]} />
      <TextInput 
        source="schema_markup" 
        validate={[]} 
        multiline 
        helperText="JSON-LD structured data (valid JSON)"
      />
    </SimpleForm>
  </Edit>
)