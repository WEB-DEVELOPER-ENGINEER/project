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
} from 'react-admin'

export const ContactSubmissionsShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="subject" />
      <TextField source="message" />
      <TextField source="phone" />
      <TextField source="service_type" />
      <TextField source="status" />
      <DateField source="submitted_at" showTime />
    </SimpleShowLayout>
  </Show>
)