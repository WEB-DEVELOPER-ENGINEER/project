import { NextRequest } from 'next/server'
import { AdminCRUD, generateSlug } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-api-utils'
import { pool } from '@/lib/database'

const servicesCRUD = new AdminCRUD(
  'services',
  [
    'title', 'content', 'icon_id', 'slug', 'sort_order', 'is_active',
    'short_description', 'overview', 'key_benefits', 'service_features',
    'process_steps', 'service_highlights', 'specifications', 'success_metrics',
    'client_testimonial', 'related_services', 'service_category', 'service_type',
    'pricing_model', 'delivery_time', 'team_size', 'languages_supported',
    'certifications', 'industry_focus', 'service_tags', 'cta_primary_text',
    'cta_secondary_text', 'cta_primary_url', 'cta_secondary_url',
    'hero_image_url', 'gallery_images', 'video_url', 'faq_items',
    'meta_title', 'meta_description', 'meta_keywords', 'schema_markup', 'category_id'
  ],
  ['title', 'content', 'short_description', 'overview'],
  ['title', 'content', 'short_description', 'overview'],
  ['content', 'overview', 'short_description']
)

export async function GET(request: NextRequest) {
  return servicesCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  console.log('POST /api/admin/services called')
  
  const { authorized } = await checkAuth()
  if (!authorized) {
    console.log('Unauthorized request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('Request body:', body)
    
    // Validate required fields
    if (!body.title || !body.content) {
      console.log('Missing required fields:', { title: !!body.title, content: !!body.content })
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: {
          title: !body.title ? 'Title is required' : null,
          content: !body.content ? 'Content is required' : null
        }
      }, { status: 400 })
    }
    
    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title)
      console.log('Generated slug:', body.slug)
    }

    // Check for duplicate slug
    if (body.slug) {
      const client = await pool.connect()
      const existingService = await client.query(
        'SELECT id FROM services WHERE slug = $1',
        [body.slug]
      )
      
      if (existingService.rows.length > 0) {
        body.slug = `${body.slug}-${Date.now()}`
        console.log('Slug conflict, using:', body.slug)
      }
      
      client.release()
    }

    // Call the CRUD create method directly instead of creating new request
    console.log('Calling servicesCRUD.create with body:', body)
    
    // Create the service using direct database insertion
    const allowedFields = [
      'title', 'content', 'icon_id', 'slug', 'sort_order', 'is_active',
      'short_description', 'overview', 'key_benefits', 'service_features',
      'process_steps', 'service_highlights', 'specifications', 'success_metrics',
      'client_testimonial', 'related_services', 'service_category', 'service_type',
      'pricing_model', 'delivery_time', 'team_size', 'languages_supported',
      'certifications', 'industry_focus', 'service_tags', 'cta_primary_text',
      'cta_secondary_text', 'cta_primary_url', 'cta_secondary_url',
      'hero_image_url', 'gallery_images', 'video_url', 'faq_items',
      'meta_title', 'meta_description', 'meta_keywords', 'schema_markup'
    ]
    const data: any = {}
    
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        // Handle JSONB fields
        if (['service_features', 'process_steps', 'service_highlights', 'specifications', 
             'success_metrics', 'client_testimonial', 'gallery_images', 'faq_items', 
             'schema_markup'].includes(field)) {
          data[field] = JSON.stringify(body[field])
        }
        // Handle array fields
        else if (['key_benefits', 'related_services', 'languages_supported', 
                 'certifications', 'industry_focus', 'service_tags', 'meta_keywords'].includes(field)) {
          data[field] = Array.isArray(body[field]) ? body[field] : []
        }
        else {
          data[field] = body[field]
        }
      }
    })

    // Set default values
    if (data.sort_order === undefined) data.sort_order = 0
    if (data.is_active === undefined) data.is_active = true

    const fields = Object.keys(data)
    const values = Object.values(data)
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ')

    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO services (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    )
    client.release()

    console.log('Service created successfully:', result.rows[0])

    return NextResponse.json({
      data: {
        id: result.rows[0].id,
        ...result.rows[0],
      },
    })

  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ 
      error: 'Failed to create service',
      details: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : undefined
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  return servicesCRUD.deleteMany(request)
}