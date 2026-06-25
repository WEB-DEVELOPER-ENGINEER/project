'use client'

import {
  Edit,
  TabbedForm,
  FormTab,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  ReferenceInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  email,
  PasswordInput,
  DateInput,
  maxLength,
} from 'react-admin'
import { CKEditorInput } from '../CKEditorInput'
import { ImageUploadInput } from '../ImageUploadInput'

export const BlogPostsEdit = () => (
  <Edit>
    <TabbedForm>
      <FormTab label="Basic Info">
        <NumberInput source="id" validate={[]} />
        <TextInput source="title" validate={[required()]} fullWidth />
        <TextInput source="slug" validate={[required()]} fullWidth helperText="URL-friendly version of title" />
        <TextInput source="description" validate={[required()]} multiline rows={3} fullWidth label="Description/Excerpt" helperText="Brief description for the blog post (required)" />
        <CKEditorInput source="content" validate={[required()]} fullWidth />
        
        <ReferenceInput source="author_id" reference="blog-authors" label="Author">
          <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput source="author" fullWidth helperText="Fallback author name" />
        
        <ReferenceInput source="category_id" reference="blog-categories" label="Category">
          <SelectInput optionText="name" />
        </ReferenceInput>
        
        <DateInput source="published_date" />
        <BooleanInput source="is_published" defaultValue={false} />
        <BooleanInput source="featured" defaultValue={false} />
      </FormTab>

      <FormTab label="Images & Media">
        <ImageUploadInput 
          source="image_url" 
          label="Featured Image" 
          helperText="Main blog post image (recommended: 1200x630px for optimal social sharing)"
          showMetadata={true}
        />
        
        <ImageUploadInput 
          source="og_image" 
          label="Open Graph Image" 
          helperText="Image for social media sharing (1200x630px)"
          showMetadata={true}
        />
        
        <ImageUploadInput 
          source="twitter_image" 
          label="Twitter Card Image" 
          helperText="Image for Twitter cards (1200x600px)"
          showMetadata={true}
        />
      </FormTab>

      <FormTab label="Content Organization">
        <ArrayInput source="tags" label="Tags">
          <SimpleFormIterator>
            <TextInput source="" helperText="Tag" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <ArrayInput source="related_services" label="Related Services">
          <SimpleFormIterator>
            <TextInput source="" helperText="Service slug or ID" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <ArrayInput source="related_projects" label="Related Projects">
          <SimpleFormIterator>
            <TextInput source="" helperText="Project slug or ID" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      <FormTab label="SEO & Meta">
        <TextInput source="meta_title" label="Meta Title" validate={[maxLength(60)]} fullWidth 
          helperText="SEO title (max 60 characters)" />
        <TextInput source="meta_description" label="Meta Description" validate={[maxLength(160)]} multiline rows={3} fullWidth 
          helperText="SEO description (max 160 characters)" />
        <TextInput source="canonical_url" label="Canonical URL" fullWidth 
          helperText="Canonical URL if different from default" />
      </FormTab>
    </TabbedForm>
  </Edit>
)