'use client'

import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  required
} from 'react-admin'

export const ServiceCategoriesEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput 
        source="name" 
        validate={[required()]} 
        fullWidth 
        helperText="Category name (e.g., Translation Services)" 
      />
      <TextInput 
        source="slug" 
        fullWidth 
        helperText="URL-friendly slug" 
        disabled
      />
      <TextInput 
        source="description" 
        multiline 
        rows={3} 
        fullWidth 
        helperText="Brief description of this service category" 
      />
      <TextInput 
        source="icon_name" 
        fullWidth 
        helperText="Lucide icon name (e.g., FileText, Globe, Shield)" 
      />
      <TextInput 
        source="color" 
        fullWidth 
        helperText="Brand color for this category (e.g., #3B82F6)" 
        placeholder="#3B82F6"
      />
      <NumberInput 
        source="sort_order" 
        defaultValue={0}
        helperText="Display order (lower numbers first)" 
      />
      <BooleanInput 
        source="is_active" 
        defaultValue={true}
        helperText="Whether this category is active and visible" 
      />
    </SimpleForm>
  </Edit>
)
