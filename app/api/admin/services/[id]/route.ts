import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return servicesCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔧 PUT /api/admin/services/[id] called with:', {
    id: params.id,
    timestamp: new Date().toISOString()
  })
  
  try {
    const body = await request.json()
    console.log('📝 Request body:', JSON.stringify(body, null, 2))
    
    // Create a new request with the body for the CRUD method
    const newRequest = new NextRequest(request.url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(request.headers.entries())
      }
    })
    
    const result = await servicesCRUD.update(params.id, newRequest)
    
    console.log('✅ Update completed successfully')
    return result
  } catch (error) {
    console.error('❌ Error in services PUT:', error)
    throw error
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return servicesCRUD.delete(params.id)
}