'use client'

import {
  Edit,
  TabbedForm,
  FormTab,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  DateInput,
  ArrayInput,
  SimpleFormIterator,
  required,
} from 'react-admin'
import { CKEditorInput } from '../CKEditorInput'

const statusChoices = [
  { id: 'completed', name: 'Completed' },
  { id: 'in_progress', name: 'In Progress' },
  { id: 'planned', name: 'Planned' },
  { id: 'on_hold', name: 'On Hold' },
]

const categoryChoices = [
  { id: 'translation', name: 'Translation' },
  { id: 'interpretation', name: 'Interpretation' },
  { id: 'localization', name: 'Localization' },
  { id: 'transcription', name: 'Transcription' },
  { id: 'proofreading', name: 'Proofreading' },
]

export const ProjectsEdit = () => (
  <Edit>
    <TabbedForm>
      <FormTab label="Basic Info">
        <NumberInput source="id" disabled />
        <TextInput source="title" validate={[required()]} fullWidth />
        <CKEditorInput source="description" validate={[required()]} fullWidth />
        <TextInput source="slug" validate={[required()]} fullWidth />
        <NumberInput source="sort_order" />
        <BooleanInput source="is_active" />
      </FormTab>

      <FormTab label="Project Details">
        <SelectInput source="category" choices={categoryChoices} />
        <SelectInput source="status" choices={statusChoices} />
        <DateInput source="project_date" />
        <TextInput source="industry" fullWidth />
        <NumberInput source="team_size" />
        <NumberInput source="word_count" />
        <NumberInput source="duration_days" />
        
        <ArrayInput source="languages">
          <SimpleFormIterator inline>
            <TextInput source="" helperText="Language" />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      <FormTab label="Content">
        <CKEditorInput source="challenge" label="Project Challenge" fullWidth />
        <CKEditorInput source="solution" label="Project Solution" fullWidth />
        
        <ArrayInput source="scope" label="Project Scope">
          <SimpleFormIterator>
            <TextInput source="" helperText="Scope item" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <ArrayInput source="deliverables" label="Project Deliverables">
          <SimpleFormIterator>
            <TextInput source="" helperText="Deliverable item" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      <FormTab label="Specifications">
        <TextInput source="technical_details.source_language" label="Source Language" />
        <TextInput source="technical_details.target_language" label="Target Language" />
        <TextInput source="technical_details.document_type" label="Document Type" />
        <TextInput source="technical_details.file_format" label="File Format" />
        <NumberInput source="technical_details.page_count" label="Page Count" />
        
        <NumberInput source="process_details.review_rounds" label="Review Rounds" />
        <NumberInput source="process_details.quality_checks" label="Quality Checks" />
        <TextInput source="process_details.delivery_method" label="Delivery Method" />
        
        <NumberInput source="quality_metrics.translation_accuracy" label="Translation Accuracy (%)" />
        <NumberInput source="quality_metrics.cultural_adaptation" label="Cultural Adaptation (%)" />
        <NumberInput source="quality_metrics.terminology_consistency" label="Terminology Consistency (%)" />
        <NumberInput source="quality_metrics.client_satisfaction" label="Client Satisfaction (%)" />
        
        <ArrayInput source="certifications" label="Certifications">
          <SimpleFormIterator>
            <TextInput source="" helperText="Certification" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      <FormTab label="Results & Impact">
        <TextInput source="key_metrics.accuracy_rate" label="Accuracy Rate" />
        <TextInput source="key_metrics.delivery_time" label="Delivery Time" />
        <TextInput source="key_metrics.client_satisfaction" label="Client Satisfaction" />
        <TextInput source="key_metrics.quality_score" label="Quality Score" />
        
        <ArrayInput source="impact_outcomes" label="Impact Outcomes">
          <SimpleFormIterator>
            <TextInput source="" helperText="Impact outcome" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
        
        <CKEditorInput source="client_testimonial.quote" label="Client Testimonial Quote" fullWidth />
        <TextInput source="client_testimonial.author" label="Testimonial Author" />
        <TextInput source="client_testimonial.company" label="Client Company" />
        <NumberInput source="client_testimonial.rating" label="Rating (1-5)" />
      </FormTab>

      <FormTab label="SEO">
        <TextInput source="meta_title" label="Meta Title" fullWidth />
        <TextInput source="meta_description" label="Meta Description" multiline fullWidth />
      </FormTab>
    </TabbedForm>
  </Edit>
)