'use client'

import {
  Create,
  TabbedForm,
  FormTab,
  TextInput,
  BooleanInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  DateInput,
  required,
} from 'react-admin'
import { CKEditorInput } from '../CKEditorInput'
import { ImageUploadInput } from '../ImageUploadInput'

export const ServicesCreate = () => (
  <Create>
    <TabbedForm>
      {/* Basic Information Tab */}
      <FormTab label="Basic Info">
        <TextInput source="title" validate={[required()]} fullWidth />
        <TextInput source="slug" validate={[required()]} helperText="URL-friendly version of title" fullWidth />
        <TextInput source="short_description" multiline rows={2} fullWidth helperText="Brief description for cards and previews" />
        <CKEditorInput source="content" validate={[required()]} helperText="Main service description" />
        <CKEditorInput source="overview" helperText="Detailed service overview for detail page" />
        <ReferenceInput source="icon_id" reference="icons">
          <SelectInput optionText="name" />
        </ReferenceInput>
        <NumberInput source="sort_order" defaultValue={0} />
        <BooleanInput source="is_active" defaultValue={true} />
      </FormTab>

      {/* Service Details Tab */}
      <FormTab label="Service Details">
        <ReferenceInput source="category_id" reference="service-categories" label="Service Category">
          <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput source="service_category" fullWidth helperText="Legacy category field - use dropdown above instead" />
        <TextInput source="service_type" fullWidth helperText="e.g., Legal Translation, Technical Translation" />
        <TextInput source="pricing_model" fullWidth helperText="e.g., Per word, Per hour, Fixed price" />
        <TextInput source="delivery_time" fullWidth helperText="e.g., 1-3 business days" />
        <TextInput source="team_size" fullWidth helperText="e.g., 2-3 experts" />
        
        <ArrayInput source="key_benefits" label="Key Benefits">
          <SimpleFormIterator inline disableReordering>
            <TextInput source="" helperText="One benefit per line" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <ArrayInput source="languages_supported" label="Supported Languages">
          <SimpleFormIterator inline disableReordering>
            <TextInput source="" helperText="Language name" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <ArrayInput source="certifications" label="Certifications">
          <SimpleFormIterator inline disableReordering>
            <TextInput source="" helperText="Certification name" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <ArrayInput source="industry_focus" label="Target Industries">
          <SimpleFormIterator inline disableReordering>
            <TextInput source="" helperText="Industry name" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <ArrayInput source="service_tags" label="Service Tags">
          <SimpleFormIterator inline disableReordering>
            <TextInput source="" helperText="Tag for search/filtering" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      {/* Features Tab */}
      <FormTab label="Features">
        <ArrayInput source="service_features" label="Service Features">
          <SimpleFormIterator>
            <TextInput source="icon" helperText="Lucide icon name" />
            <TextInput source="title" validate={[required()]} fullWidth />
            <TextInput source="description" multiline rows={2} fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      {/* Process Tab */}
      <FormTab label="Process">
        <ArrayInput source="process_steps" label="Process Steps">
          <SimpleFormIterator>
            <NumberInput source="step" validate={[required()]} helperText="Step number" />
            <TextInput source="title" validate={[required()]} fullWidth />
            <TextInput source="description" multiline rows={2} fullWidth />
            <TextInput source="icon" helperText="Lucide icon name" />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      {/* Specifications Tab */}
      <FormTab label="Specifications">
        <ArrayInput source="specifications.document_types" label="Document Types">
          <SimpleFormIterator inline disableReordering>
            <TextInput source="" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <ArrayInput source="specifications.industries" label="Industries Served">
          <SimpleFormIterator inline disableReordering>
            <TextInput source="" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <ArrayInput source="specifications.formats" label="Supported Formats">
          <SimpleFormIterator inline disableReordering>
            <TextInput source="" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <ArrayInput source="specifications.tools" label="Tools Used">
          <SimpleFormIterator inline disableReordering>
            <TextInput source="" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      {/* Metrics & Testimonial Tab */}
      <FormTab label="Metrics">
        <TextInput source="success_metrics.accuracy_rate" label="Accuracy Rate" helperText="e.g., 99.9%" />
        <TextInput source="success_metrics.client_satisfaction" label="Client Satisfaction" helperText="e.g., 98%" />
        <TextInput source="success_metrics.projects_completed" label="Projects Completed" helperText="e.g., 2500+" />
        <TextInput source="success_metrics.average_turnaround" label="Average Turnaround" helperText="e.g., 2 days" />
        
        <TextInput source="client_testimonial.quote" label="Testimonial Quote" multiline rows={3} fullWidth />
        <TextInput source="client_testimonial.author" label="Testimonial Author" fullWidth />
        <TextInput source="client_testimonial.company" label="Author Company" fullWidth />
        <TextInput source="client_testimonial.position" label="Author Position" fullWidth />
        <NumberInput source="client_testimonial.rating" label="Rating (1-5)" min={1} max={5} />
      </FormTab>

      {/* Service Highlights Tab */}
      <FormTab label="Highlights">
        <TextInput source="service_highlights.delivery_time" label="Delivery Time" fullWidth />
        <TextInput source="service_highlights.team_size" label="Team Size" fullWidth />
        <TextInput source="service_highlights.support" label="Support" fullWidth />
        <TextInput source="service_highlights.guarantee" label="Guarantee" fullWidth />
        <TextInput source="service_highlights.turnaround" label="Turnaround" fullWidth />
        <TextInput source="service_highlights.certification" label="Certification" fullWidth />
      </FormTab>

      {/* CTA & Media Tab */}
      <FormTab label="CTA & Media">
        <TextInput source="cta_primary_text" label="Primary CTA Text" fullWidth />
        <TextInput source="cta_secondary_text" label="Secondary CTA Text" fullWidth />
        <TextInput source="cta_primary_url" label="Primary CTA URL" fullWidth />
        <TextInput source="cta_secondary_url" label="Secondary CTA URL" fullWidth />
        
        <ImageUploadInput 
          source="hero_image_url" 
          label="Hero Image" 
          helperText="Service hero image (recommended: 1200x600px for optimal display)"
          showMetadata={true}
        />
        <TextInput source="video_url" label="Service Video URL" fullWidth />
        
        <ArrayInput source="gallery_images" label="Gallery Images">
          <SimpleFormIterator>
            <TextInput source="url" label="Image URL" fullWidth />
            <TextInput source="alt" label="Alt Text" fullWidth />
            <TextInput source="caption" label="Caption" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      {/* FAQ Tab */}
      <FormTab label="FAQ">
        <ArrayInput source="faq_items" label="Frequently Asked Questions">
          <SimpleFormIterator>
            <TextInput source="question" validate={[required()]} fullWidth />
            <TextInput source="answer" multiline rows={3} validate={[required()]} fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      {/* SEO Tab */}
      <FormTab label="SEO">
        <TextInput source="meta_title" label="Meta Title" fullWidth helperText="Max 60 characters" />
        <TextInput source="meta_description" label="Meta Description" multiline rows={3} fullWidth helperText="Max 160 characters" />
        
        <ArrayInput source="meta_keywords" label="Meta Keywords">
          <SimpleFormIterator inline disableReordering>
            <TextInput source="" helperText="One keyword per line" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <CKEditorInput source="schema_markup" label="Custom Schema Markup (JSON)" helperText="Advanced: Custom structured data" />
      </FormTab>
    </TabbedForm>
  </Create>
)