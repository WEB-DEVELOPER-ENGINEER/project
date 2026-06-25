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

export const UsersShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="id" />
      <EmailField source="email" />
      <TextField source="name" />
      <TextField source="password" />
      <TextField source="role" />
      <BooleanField source="is_active" />
      <DateField source="last_login" showTime />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
)