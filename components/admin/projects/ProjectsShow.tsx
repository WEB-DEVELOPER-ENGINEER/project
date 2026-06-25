'use client'

import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  BooleanField,
  EmailField,
  UrlField,
  NumberField,
  RichTextField,
  ArrayField,
  Datagrid,
  ImageField,
  TabbedShowLayout,
  Tab,
  ReferenceManyField,
  ChipField,
  FunctionField,
} from 'react-admin'

export const ProjectsShow = () => (
  <Show>
    <TabbedShowLayout>
      <Tab label="Basic Info">
        <NumberField source="id" />
        <TextField source="title" />
        <RichTextField source="description" />
        <TextField source="slug" />
        <NumberField source="sort_order" />
        <BooleanField source="is_active" />
        <DateField source="created_at" showTime />
        <DateField source="updated_at" showTime />
      </Tab>

      <Tab label="Project Details">
        <TextField source="category" />
        <TextField source="status" />
        <DateField source="project_date" />
        <TextField source="industry" />
        <NumberField source="team_size" />
        <NumberField source="word_count" />
        <NumberField source="duration_days" />
        
        <FunctionField 
          source="languages" 
          label="Languages"
          render={(record: any) => 
            Array.isArray(record.languages) && record.languages.length > 0
              ? record.languages.join(', ')
              : 'No languages specified'
          }
        />
      </Tab>

      <Tab label="Content">
        <RichTextField source="challenge" label="Project Challenge" />
        <RichTextField source="solution" label="Project Solution" />
        
        <FunctionField 
          source="scope" 
          label="Project Scope"
          render={(record: any) => 
            Array.isArray(record.scope) && record.scope.length > 0
              ? record.scope.join(', ')
              : 'No scope specified'
          }
        />
        
        <FunctionField 
          source="deliverables" 
          label="Project Deliverables"
          render={(record: any) => 
            Array.isArray(record.deliverables) && record.deliverables.length > 0
              ? record.deliverables.join(', ')
              : 'No deliverables specified'
          }
        />
      </Tab>

      <Tab label="Specifications">
        <TextField source="technical_details.source_language" label="Source Language" />
        <TextField source="technical_details.target_language" label="Target Language" />
        <TextField source="technical_details.document_type" label="Document Type" />
        <TextField source="technical_details.file_format" label="File Format" />
        <NumberField source="technical_details.page_count" label="Page Count" />
        
        <NumberField source="process_details.review_rounds" label="Review Rounds" />
        <NumberField source="process_details.quality_checks" label="Quality Checks" />
        <TextField source="process_details.delivery_method" label="Delivery Method" />
        
        <NumberField source="quality_metrics.translation_accuracy" label="Translation Accuracy (%)" />
        <NumberField source="quality_metrics.cultural_adaptation" label="Cultural Adaptation (%)" />
        <NumberField source="quality_metrics.terminology_consistency" label="Terminology Consistency (%)" />
        <NumberField source="quality_metrics.client_satisfaction" label="Client Satisfaction (%)" />
        
        <FunctionField 
          source="certifications" 
          label="Certifications"
          render={(record: any) => 
            Array.isArray(record.certifications) && record.certifications.length > 0
              ? record.certifications.join(', ')
              : 'No certifications specified'
          }
        />
      </Tab>

      <Tab label="Results & Impact">
        <TextField source="key_metrics.accuracy_rate" label="Accuracy Rate" />
        <TextField source="key_metrics.delivery_time" label="Delivery Time" />
        <TextField source="key_metrics.client_satisfaction" label="Client Satisfaction" />
        <TextField source="key_metrics.quality_score" label="Quality Score" />
        
        <FunctionField 
          source="impact_outcomes" 
          label="Impact Outcomes"
          render={(record: any) => 
            Array.isArray(record.impact_outcomes) && record.impact_outcomes.length > 0
              ? record.impact_outcomes.join(', ')
              : 'No impact outcomes specified'
          }
        />
        
        <RichTextField source="client_testimonial.quote" label="Client Testimonial Quote" />
        <TextField source="client_testimonial.author" label="Testimonial Author" />
        <TextField source="client_testimonial.company" label="Client Company" />
        <NumberField source="client_testimonial.rating" label="Rating" />
      </Tab>
      
      <Tab label="Images">
        <ArrayField source="images">
          <Datagrid>
            <ImageField source="image_url" title="alt_text" />
            <TextField source="description" />
            <TextField source="alt_text" />
            <NumberField source="sort_order" />
          </Datagrid>
        </ArrayField>
      </Tab>

      <Tab label="SEO">
        <TextField source="meta_title" label="Meta Title" />
        <TextField source="meta_description" label="Meta Description" />
      </Tab>
    </TabbedShowLayout>
  </Show>
)