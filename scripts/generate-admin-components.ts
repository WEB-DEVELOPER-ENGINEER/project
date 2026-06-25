#!/usr/bin/env npx tsx

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Define all resources with their React Admin configurations
const resources = [
  {
    name: 'icons',
    label: 'Icons',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'name', type: 'text', list: true, required: true },
      { name: 'icon_class', type: 'text', list: true },
      { name: 'image_url', type: 'url' },
      { name: 'link', type: 'url' },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['name'],
    sortable: { field: 'name', order: 'ASC' }
  },
  {
    name: 'top-bar-items',
    label: 'Top Bar Items',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'name', type: 'text', list: true, required: true },
      { name: 'link', type: 'url', list: true, required: true },
      { name: 'icon_id', type: 'number' },
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['name'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'header-items',
    label: 'Header Items',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'name', type: 'text', list: true, required: true },
      { name: 'link', type: 'url', list: true },
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['name'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'sliders',
    label: 'Hero Sliders',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'title', type: 'text', list: true, required: true },
      { name: 'description', type: 'richtext', required: true },
      { name: 'image_url', type: 'url' },
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['title', 'description'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'services',
    label: 'Services',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'title', type: 'text', list: true, required: true },
      { name: 'content', type: 'richtext', required: true },
      { name: 'icon_id', type: 'number' },
      { name: 'slug', type: 'text', list: true, required: true },
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['title', 'content'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'clients',
    label: 'Clients',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'title', type: 'text', list: true, required: true },
      { name: 'description', type: 'richtext', required: true },
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['title', 'description'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'projects',
    label: 'Projects',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'title', type: 'text', list: true, required: true },
      { name: 'description', type: 'richtext', required: true },
      { name: 'slug', type: 'text', list: true, required: true },
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['title', 'description'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'blog-posts',
    label: 'Blog Posts',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'title', type: 'text', list: true, required: true },
      { name: 'slug', type: 'text', list: true, required: true },
      { name: 'description', type: 'richtext', required: true },
      { name: 'content', type: 'richtext', required: true },
      { name: 'image_url', type: 'url' },
      { name: 'author', type: 'text', list: true },
      { name: 'published_date', type: 'date', list: true },
      { name: 'is_published', type: 'boolean', list: true },
      { name: 'meta_title', type: 'text' },
      { name: 'meta_description', type: 'text' },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['title', 'description', 'content'],
    sortable: { field: 'published_date', order: 'DESC' }
  },
  {
    name: 'testimonials',
    label: 'Testimonials',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'name', type: 'text', list: true, required: true },
      { name: 'description', type: 'richtext', required: true },
      { name: 'company', type: 'text', list: true },
      { name: 'position', type: 'text', list: true },
      { name: 'image_url', type: 'url' },
      { name: 'rating', type: 'number', list: true },
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['name', 'description', 'company'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'team-members',
    label: 'Team Members',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'name', type: 'text', list: true, required: true },
      { name: 'job_title', type: 'text', list: true, required: true },
      { name: 'image_url', type: 'url' },
      { name: 'bio', type: 'richtext' },
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['name', 'job_title'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'about-us',
    label: 'About Us',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'title', type: 'text', list: true, required: true },
      { name: 'slogan', type: 'text', list: true },
      { name: 'description', type: 'richtext', required: true },
      { name: 'image_url', type: 'url' },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['title', 'description'],
    sortable: { field: 'created_at', order: 'DESC' }
  },
  {
    name: 'contact-submissions',
    label: 'Contact Submissions',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'name', type: 'text', list: true, readonly: true },
      { name: 'email', type: 'email', list: true, readonly: true },
      { name: 'subject', type: 'text', list: true, readonly: true },
      { name: 'message', type: 'text', readonly: true },
      { name: 'phone', type: 'text', readonly: true },
      { name: 'service_type', type: 'text', list: true, readonly: true },
      { name: 'status', type: 'select', list: true, choices: [
        { id: 'new', name: 'New' },
        { id: 'in_progress', name: 'In Progress' },
        { id: 'completed', name: 'Completed' },
        { id: 'spam', name: 'Spam' }
      ]},
      { name: 'submitted_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['name', 'email', 'subject', 'message'],
    sortable: { field: 'submitted_at', order: 'DESC' },
    readonly: true
  },
  {
    name: 'seo-metadata',
    label: 'SEO Metadata',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'page_type', type: 'text', list: true, required: true },
      { name: 'page_id', type: 'number', list: true },
      { name: 'meta_title', type: 'text' },
      { name: 'meta_description', type: 'text' },
      { name: 'canonical_url', type: 'url' },
      { name: 'og_title', type: 'text' },
      { name: 'og_description', type: 'text' },
      { name: 'og_image', type: 'url' },
      { name: 'twitter_title', type: 'text' },
      { name: 'twitter_description', type: 'text' },
      { name: 'twitter_image', type: 'url' },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['page_type', 'meta_title'],
    sortable: { field: 'page_type', order: 'ASC' }
  },
  {
    name: 'features',
    label: 'Features',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'title', type: 'text', list: true, required: true },
      { name: 'description', type: 'richtext', required: true },
      { name: 'icon_name', type: 'text', list: true },
      { name: 'icon_color', type: 'text' },
      { name: 'category', type: 'text', list: true },
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['title', 'description', 'category'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'footer-sections',
    label: 'Footer Sections',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'title', type: 'text', list: true, required: true },
      { name: 'section_type', type: 'select', list: true, required: true, choices: [
        { id: 'main', name: 'Main' },
        { id: 'legal', name: 'Legal' },
        { id: 'social', name: 'Social' },
        { id: 'newsletter', name: 'Newsletter' }
      ]},
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['title'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'footer-links',
    label: 'Footer Links',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'footer_section_id', type: 'number', list: true, required: true },
      { name: 'name', type: 'text', list: true, required: true },
      { name: 'url', type: 'url', list: true, required: true },
      { name: 'icon_id', type: 'number' },
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['name'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'cta-sections',
    label: 'CTA Sections',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'title', type: 'text', list: true, required: true },
      { name: 'description', type: 'richtext' },
      { name: 'primary_button_text', type: 'text' },
      { name: 'primary_button_url', type: 'url' },
      { name: 'secondary_button_text', type: 'text' },
      { name: 'secondary_button_url', type: 'url' },
      { name: 'background_type', type: 'select', list: true, choices: [
        { id: 'gradient', name: 'Gradient' },
        { id: 'image', name: 'Image' },
        { id: 'solid', name: 'Solid' }
      ]},
      { name: 'background_value', type: 'text' },
      { name: 'section_location', type: 'text', list: true },
      { name: 'sort_order', type: 'number', list: true },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['title', 'section_location'],
    sortable: { field: 'sort_order', order: 'ASC' }
  },
  {
    name: 'site-settings',
    label: 'Site Settings',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'setting_key', type: 'text', list: true, required: true },
      { name: 'setting_value', type: 'text', required: true },
      { name: 'setting_type', type: 'select', list: true, choices: [
        { id: 'text', name: 'Text' },
        { id: 'json', name: 'JSON' },
        { id: 'boolean', name: 'Boolean' },
        { id: 'number', name: 'Number' }
      ]},
      { name: 'description', type: 'text' },
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['setting_key', 'description'],
    sortable: { field: 'setting_key', order: 'ASC' }
  },
  {
    name: 'users',
    label: 'Admin Users',
    fields: [
      { name: 'id', type: 'number', list: true },
      { name: 'email', type: 'email', list: true, required: true },
      { name: 'name', type: 'text', list: true, required: true },
      { name: 'password', type: 'password', createOnly: true },
      { name: 'role', type: 'select', list: true, choices: [
        { id: 'admin', name: 'Admin' },
        { id: 'super_admin', name: 'Super Admin' },
        { id: 'editor', name: 'Editor' }
      ]},
      { name: 'is_active', type: 'boolean', list: true },
      { name: 'last_login', type: 'date', list: true, readonly: true },
      { name: 'created_at', type: 'date', list: true, readonly: true },
    ],
    searchable: ['email', 'name'],
    sortable: { field: 'created_at', order: 'DESC' }
  }
]

function generateListComponent(resource: any) {
  const imports = `'use client'

import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  EditButton,
  ShowButton,
  DeleteButton,
  SearchInput,
  TextInput,
  BooleanInput,
  SelectInput,
  FilterButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  EmailField,
  UrlField,
  NumberField,
} from 'react-admin'`

  const filterElements = ['<SearchInput key="search" source="q" alwaysOn />']
  
  // Add boolean filters
  resource.fields.filter((f: any) => f.type === 'boolean').forEach((f: any) => {
    filterElements.push(`<BooleanInput key="${f.name}" label="${f.name.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}" source="${f.name}" />`)
  })
  
  // Add select filters  
  resource.fields.filter((f: any) => f.type === 'select').forEach((f: any) => {
    filterElements.push(`<SelectInput key="${f.name}" label="${f.name.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}" source="${f.name}" choices={${JSON.stringify(f.choices)}} />`)
  })

  const filters = resource.searchable.length > 0 ? `
const ${resource.name.replace(/-/g, '')}Filters = [
  ${filterElements.join(',\n  ')}
]` : ''

  const actions = resource.readonly ? `
const ${resource.name.replace(/-/g, '')}ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
)` : `
const ${resource.name.replace(/-/g, '')}ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
)`

  const datagridFields = resource.fields.filter((f: any) => f.list).map((field: any) => {
    switch (field.type) {
      case 'email':
        return `      <EmailField source="${field.name}" />`
      case 'url':
        return `      <UrlField source="${field.name}" />`
      case 'date':
        return `      <DateField source="${field.name}" showTime />`
      case 'boolean':
        return `      <BooleanField source="${field.name}" />`
      case 'number':
        return `      <NumberField source="${field.name}" />`
      default:
        return `      <TextField source="${field.name}" />`
    }
  }).join('\n')

  const actionButtons = resource.readonly ? `
      <ShowButton />` : `
      <EditButton />
      <ShowButton />
      <DeleteButton />`

  return `${imports}
${filters}
${actions}

export const ${resource.name.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}List = () => (
  <List
    ${filters ? `filters={${resource.name.replace(/-/g, '')}Filters}` : ''}
    actions={<${resource.name.replace(/-/g, '')}ListActions />}
    sort={{ field: '${resource.sortable.field}', order: '${resource.sortable.order}' }}
    perPage={25}
  >
    <Datagrid>
${datagridFields}${actionButtons}
    </Datagrid>
  </List>
)`
}

function generateCreateComponent(resource: any) {
  if (resource.readonly) return ''

  const imports = `'use client'

import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  required,
  email,
  PasswordInput,
} from 'react-admin'
import { CKEditorInput } from '../CKEditorInput'`

  const formFields = resource.fields.filter((f: any) => !f.readonly && f.name !== 'id' && f.name !== 'created_at' && f.name !== 'updated_at').map((field: any) => {
    const validation = field.required ? '[required()]' : '[]'
    
    switch (field.type) {
      case 'richtext':
        return `      <CKEditorInput source="${field.name}" validate={${validation}} />`
      case 'email':
        return `      <TextInput source="${field.name}" validate={[${field.required ? 'required(), ' : ''}email()]} />`
      case 'password':
        return `      <PasswordInput source="${field.name}" validate={${validation}} />`
      case 'boolean':
        return `      <BooleanInput source="${field.name}" />`
      case 'number':
        return `      <NumberInput source="${field.name}" validate={${validation}} />`
      case 'select':
        return `      <SelectInput source="${field.name}" choices={${JSON.stringify(field.choices)}} validate={${validation}} />`
      default:
        return `      <TextInput source="${field.name}" validate={${validation}} />`
    }
  }).join('\n')

  return `${imports}

export const ${resource.name.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Create = () => (
  <Create>
    <SimpleForm>
${formFields}
    </SimpleForm>
  </Create>
)`
}

function generateEditComponent(resource: any) {
  if (resource.readonly) return ''

  const imports = `'use client'

import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  required,
  email,
  PasswordInput,
} from 'react-admin'
import { CKEditorInput } from '../CKEditorInput'`

  const formFields = resource.fields.filter((f: any) => !f.readonly && !f.createOnly).map((field: any) => {
    const validation = field.required ? '[required()]' : '[]'
    
    switch (field.type) {
      case 'richtext':
        return `      <CKEditorInput source="${field.name}" validate={${validation}} />`
      case 'email':
        return `      <TextInput source="${field.name}" validate={[${field.required ? 'required(), ' : ''}email()]} />`
      case 'password':
        return `      <PasswordInput source="${field.name}" validate={${validation}} />`
      case 'boolean':
        return `      <BooleanInput source="${field.name}" />`
      case 'number':
        return `      <NumberInput source="${field.name}" validate={${validation}} />`
      case 'select':
        return `      <SelectInput source="${field.name}" choices={${JSON.stringify(field.choices)}} validate={${validation}} />`
      default:
        return `      <TextInput source="${field.name}" validate={${validation}} />`
    }
  }).join('\n')

  return `${imports}

export const ${resource.name.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Edit = () => (
  <Edit>
    <SimpleForm>
${formFields}
    </SimpleForm>
  </Edit>
)`
}

function generateShowComponent(resource: any) {
  const imports = `'use client'

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
} from 'react-admin'`

  const showFields = resource.fields.map((field: any) => {
    switch (field.type) {
      case 'richtext':
        return `      <RichTextField source="${field.name}" />`
      case 'email':
        return `      <EmailField source="${field.name}" />`
      case 'url':
        return `      <UrlField source="${field.name}" />`
      case 'date':
        return `      <DateField source="${field.name}" showTime />`
      case 'boolean':
        return `      <BooleanField source="${field.name}" />`
      case 'number':
        return `      <NumberField source="${field.name}" />`
      default:
        return `      <TextField source="${field.name}" />`
    }
  }).join('\n')

  return `${imports}

export const ${resource.name.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Show = () => (
  <Show>
    <SimpleShowLayout>
${showFields}
    </SimpleShowLayout>
  </Show>
)`
}

// Generate all components
resources.forEach(resource => {
  const basePath = join(process.cwd(), 'components', 'admin', resource.name)
  mkdirSync(basePath, { recursive: true })

  // Generate List component
  const listContent = generateListComponent(resource)
  writeFileSync(join(basePath, `${resource.name.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}List.tsx`), listContent)

  // Generate Create component (if not readonly)
  if (!resource.readonly) {
    const createContent = generateCreateComponent(resource)
    if (createContent) {
      writeFileSync(join(basePath, `${resource.name.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Create.tsx`), createContent)
    }

    // Generate Edit component (if not readonly)
    const editContent = generateEditComponent(resource)
    if (editContent) {
      writeFileSync(join(basePath, `${resource.name.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Edit.tsx`), editContent)
    }
  }

  // Generate Show component
  const showContent = generateShowComponent(resource)
  writeFileSync(join(basePath, `${resource.name.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Show.tsx`), showContent)

  console.log(`Generated React Admin components for ${resource.name}`)
})

console.log('All React Admin components generated successfully!')