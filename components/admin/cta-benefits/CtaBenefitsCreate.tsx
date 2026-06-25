'use client'

import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  required,
} from 'react-admin'

export const CtaBenefitsCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="cta_section_id" reference="cta-sections">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      <TextInput source="benefit_text" validate={[required()]} />
      <TextInput source="icon_name" validate={[]} helperText="Lucide icon name (e.g., check, star, heart)" />
      <NumberInput source="sort_order" defaultValue={0} />
    </SimpleForm>
  </Create>
)