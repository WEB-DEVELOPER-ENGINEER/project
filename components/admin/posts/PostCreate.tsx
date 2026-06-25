'use client'

import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  BooleanInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  TabbedForm,
  FormTab,
} from 'react-admin'
import { CKEditorInput } from '../CKEditorInput'
import { ImageUploadInput } from '../ImageUploadInput'

export const PostCreate = () => (
  <Create>
    <TabbedForm>
      <FormTab label="Basic Info">
        <TextInput source="title" validate={[required()]} fullWidth />
        <TextInput source="slug" validate={[required()]} fullWidth />
        <TextInput source="description" validate={[required()]} multiline rows={3} fullWidth helperText="Brief description/excerpt for the blog post (required)" />
        <TextInput source="excerpt" multiline rows={2} fullWidth helperText="Short excerpt for previews" />
        <CKEditorInput source="content" label="Content" />
        <ImageUploadInput 
          source="image_url" 
          label="Featured Image" 
          helperText="Main blog post image (recommended: 1200x630px for optimal social sharing)"
          showMetadata={true}
        />
      </FormTab>
      
      <FormTab label="Author & Category">
        <ReferenceInput source="author_id" reference="blog_authors" label="Author">
          <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput source="author" defaultValue="JUSOR Team" fullWidth helperText="Fallback author name" />
        
        <ReferenceInput source="category_id" reference="blog_categories" label="Category">
          <SelectInput optionText="name" />
        </ReferenceInput>
        
        <ArrayInput source="tags" label="Tags">
          <SimpleFormIterator>
            <TextInput source="." label="Tag" />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
      
      <FormTab label="Publishing">
        <DateInput source="published_date" defaultValue={new Date().toISOString().split('T')[0]} />
        <BooleanInput source="is_published" defaultValue={true} />
        <BooleanInput source="featured" defaultValue={false} label="Featured Post" />
        <NumberInput source="reading_time" label="Reading Time (minutes)" helperText="Auto-calculated if left empty" />
      </FormTab>
      
      <FormTab label="Related Content">
        <ArrayInput source="related_services" label="Related Services">
          <SimpleFormIterator>
            <TextInput source="." label="Service Slug" />
          </SimpleFormIterator>
        </ArrayInput>
        
        <ArrayInput source="related_projects" label="Related Projects">
          <SimpleFormIterator>
            <TextInput source="." label="Project Slug" />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
      
      <FormTab label="SEO & Social">
        <TextInput source="meta_title" label="SEO Title" fullWidth />
        <TextInput source="meta_description" label="SEO Description" multiline rows={2} fullWidth />
        <TextInput source="canonical_url" label="Canonical URL" fullWidth />
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
    </TabbedForm>
  </Create>
)