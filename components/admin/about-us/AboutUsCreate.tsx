'use client'

import React from 'react'
import {
  Create,
  TabbedForm,
  FormTab,
  TextInput,
  BooleanInput,
  NumberInput,
  required,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
} from 'react-admin'
import { CKEditorInput } from '../CKEditorInput'
import { ImageUploadInput } from '../ImageUploadInput'
import SimpleImageUpload from '../SimpleImageUpload'

export const AboutUsCreate = () => (
  <Create>
    <TabbedForm>
      {/* Basic Information Tab */}
      <FormTab label="Basic Info">
        <TextInput source="title" validate={[required()]} fullWidth />
        <TextInput source="slogan" fullWidth multiline rows={2} />
        <CKEditorInput source="description" validate={[required()]} />
        <BooleanInput source="is_active" defaultValue={true} />
      </FormTab>

      {/* Hero Section Tab */}
      <FormTab label="Hero Section">
        <SimpleImageUpload 
          source="hero_image_url" 
          label="Hero Image"
          helperText="Main hero image for the about page (recommended: 1920x1080px)"
          showPreview={true}
        />
        <TextInput source="hero_video_url" label="Hero Video URL" fullWidth />
        
        <TextInput source="hero_cta_primary_text" label="Primary CTA Text" defaultValue="Get Started Today" />
        <TextInput source="hero_cta_primary_url" label="Primary CTA URL" defaultValue="/contact" />
        <TextInput source="hero_cta_secondary_text" label="Secondary CTA Text" defaultValue="Our Services" />
        <TextInput source="hero_cta_secondary_url" label="Secondary CTA URL" defaultValue="/services" />
      </FormTab>

      {/* Mission, Vision, Purpose Tab */}
      <FormTab label="Mission & Vision">
        <CKEditorInput source="mission" label="Mission Statement" />
        <CKEditorInput source="vision" label="Vision Statement" />
        <CKEditorInput source="purpose" label="Purpose Statement" />
        <SimpleImageUpload 
          source="mission_image_url" 
          label="Mission Section Image"
          helperText="Image for mission/vision section (recommended: 800x1000px)"
          showPreview={true}
        />
      </FormTab>

      {/* Company Story Tab */}
      <FormTab label="Company Story">
        <CKEditorInput source="story" label="Company Story (Part 1)" />
        <CKEditorInput source="story_continuation" label="Company Story (Part 2)" />
        <SimpleImageUpload 
          source="story_image_url" 
          label="Story Section Image"
          helperText="Image for company story section"
          showPreview={true}
        />
      </FormTab>

      {/* Values Tab */}
      <FormTab label="Values">
        <ArrayInput source="values" label="Company Values">
          <SimpleFormIterator>
            <TextInput source="title" label="Value Title" validate={[required()]} />
            <TextInput source="description" label="Value Description" multiline rows={3} />
            <TextInput source="icon" label="Icon Name (Lucide)" helperText="e.g., Heart, Target, Users" />
            <SelectInput 
              source="color" 
              label="Color Theme"
              choices={[
                { id: 'orange', name: 'Orange' },
                { id: 'blue', name: 'Blue' },
                { id: 'green', name: 'Green' },
                { id: 'purple', name: 'Purple' },
                { id: 'red', name: 'Red' },
              ]}
              defaultValue="orange"
            />
            <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
          </SimpleFormIterator>
        </ArrayInput>
        <SimpleImageUpload 
          source="values_image_url" 
          label="Values Section Image"
          showPreview={true}
        />
      </FormTab>

      {/* Timeline Tab */}
      <FormTab label="Timeline">
        <ArrayInput source="timeline_phases" label="Company Timeline">
          <SimpleFormIterator>
            <TextInput source="year" label="Year" validate={[required()]} />
            <TextInput source="title" label="Milestone Title" validate={[required()]} />
            <TextInput source="description" label="Description" multiline rows={2} />
            <TextInput source="icon" label="Icon Name (Lucide)" />
            <ImageUploadInput 
              source="image_url" 
              label="Phase Image" 
              helperText="Timeline phase image (recommended: 400x300px for optimal display)"
              showMetadata={true}
            />
            <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
          </SimpleFormIterator>
        </ArrayInput>
        <SimpleImageUpload 
          source="timeline_image_url" 
          label="Timeline Section Image"
          showPreview={true}
        />
      </FormTab>

      {/* Achievements & Certifications Tab */}
      <FormTab label="Achievements">
        <ArrayInput source="achievements" label="Company Achievements">
          <SimpleFormIterator>
            <TextInput source="title" label="Achievement Title" validate={[required()]} />
            <TextInput source="description" label="Description" multiline rows={2} />
            <TextInput source="value" label="Achievement Value" helperText="e.g., 500+, 99.8%" />
            <TextInput source="icon" label="Icon Name (Lucide)" />
            <SelectInput 
              source="category" 
              label="Category"
              choices={[
                { id: 'stats', name: 'Statistics' },
                { id: 'awards', name: 'Awards' },
                { id: 'certifications', name: 'Certifications' },
                { id: 'milestones', name: 'Milestones' },
              ]}
              defaultValue="stats"
            />
            <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
          </SimpleFormIterator>
        </ArrayInput>

        <ArrayInput source="certifications" label="Certifications">
          <SimpleFormIterator>
            <TextInput source="name" label="Certification Name" validate={[required()]} />
            <TextInput source="issuer" label="Issuing Organization" />
            <TextInput source="date_issued" label="Date Issued" type="date" />
            <TextInput source="expiry_date" label="Expiry Date" type="date" />
            <TextInput source="certificate_url" label="Certificate URL" />
            <ImageUploadInput 
              source="image_url" 
              label="Certificate Image" 
              helperText="Certificate image (recommended: 400x300px for optimal display)"
              showMetadata={true}
            />
            <TextInput source="description" label="Description" multiline rows={2} />
            <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      {/* Leadership Tab */}
      <FormTab label="Leadership">
        <CKEditorInput source="leadership_message" label="Leadership Message" />
        <TextInput source="leadership_name" label="Leader Name" />
        <TextInput source="leadership_title" label="Leader Title" />
        <SimpleImageUpload 
          source="leadership_image_url" 
          label="Leadership Image"
          helperText="Photo of company leader (recommended: 400x400px)"
          showPreview={true}
        />
      </FormTab>

      {/* Call to Action Tab */}
      <FormTab label="Call to Action">
        <TextInput source="cta_title" label="CTA Title" fullWidth defaultValue="Ready to Get Started?" />
        <CKEditorInput source="cta_description" label="CTA Description" />
        <TextInput source="cta_primary_text" label="Primary Button Text" defaultValue="Contact Us" />
        <TextInput source="cta_primary_url" label="Primary Button URL" defaultValue="/contact" />
        <TextInput source="cta_secondary_text" label="Secondary Button Text" defaultValue="View Services" />
        <TextInput source="cta_secondary_url" label="Secondary Button URL" defaultValue="/services" />
        <SimpleImageUpload 
          source="cta_background_image_url" 
          label="CTA Background Image"
          helperText="Background image for CTA section"
          showPreview={true}
        />
      </FormTab>

      {/* SEO & Meta Tab */}
      <FormTab label="SEO & Meta">
        <TextInput source="meta_title" label="Meta Title" fullWidth helperText="Max 60 characters" />
        <TextInput source="meta_description" label="Meta Description" fullWidth multiline rows={3} helperText="Max 160 characters" />
        <ArrayInput source="meta_keywords" label="Meta Keywords">
          <SimpleFormIterator>
            <TextInput source="" label="Keyword" />
          </SimpleFormIterator>
        </ArrayInput>
        <TextInput source="canonical_url" label="Canonical URL" fullWidth />
        
        <SimpleImageUpload 
          source="og_image_url" 
          label="Open Graph Image"
          helperText="Social media sharing image (recommended: 1200x630px)"
          showPreview={true}
        />
        <SimpleImageUpload 
          source="twitter_image_url" 
          label="Twitter Card Image"
          helperText="Twitter sharing image (recommended: 1200x600px)"
          showPreview={true}
        />
      </FormTab>

      {/* Legacy Tab */}
      <FormTab label="Legacy">
        <SimpleImageUpload 
          source="image_url" 
          label="Legacy Image URL" 
          helperText="Kept for backward compatibility"
          showPreview={true}
        />
      </FormTab>
    </TabbedForm>
  </Create>
)