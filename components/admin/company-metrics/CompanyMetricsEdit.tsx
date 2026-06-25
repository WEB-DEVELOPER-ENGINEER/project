'use client'

import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  required,
  Toolbar,
  SaveButton,
  DeleteButton,
} from 'react-admin'

const CompanyMetricsEditToolbar = () => (
  <Toolbar>
    <SaveButton />
    <DeleteButton />
  </Toolbar>
)

export const CompanyMetricsEdit = () => (
  <Edit>
    <SimpleForm toolbar={<CompanyMetricsEditToolbar />}>
      <TextInput source="metric_key" validate={[required()]} fullWidth helperText="Unique identifier (e.g., projects_completed)" />
      <TextInput source="metric_value" validate={[required()]} fullWidth helperText="Display value (e.g., 500+, 99.8%)" />
      <TextInput source="metric_label" validate={[required()]} fullWidth helperText="Display label (e.g., Projects Completed)" />
      <TextInput source="metric_description" multiline rows={2} fullWidth />
      
      <SelectInput source="category" validate={[required()]} choices={[
        { id: 'stats', name: 'Statistics' },
        { id: 'achievements', name: 'Achievements' },
        { id: 'certifications', name: 'Certifications' },
        { id: 'benefits', name: 'Benefits' },
      ]} />
      
      <TextInput source="icon_name" fullWidth helperText="Lucide icon name (e.g., CheckCircle, Star)" />
      <TextInput source="color_class" fullWidth helperText="CSS color class (e.g., text-brand-orange)" />
      
      <NumberInput source="display_order" />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Edit>
)