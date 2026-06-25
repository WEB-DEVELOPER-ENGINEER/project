import { NextRequest, NextResponse } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'
import { checkAuth } from '@/lib/admin-api-utils'
import { pool } from '@/lib/database'

const serviceCategoriesCRUD = new AdminCRUD(
  'service_categories',
  ['name', 'slug', 'description', 'icon_name', 'color', 'sort_order', 'is_active'],
  ['name', 'slug'],
  ['name', 'description'],
  ['description']
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active_only') === 'true'
    
    if (activeOnly) {
      // Return active categories for frontend filtering
      const client = await pool.connect()
      const result = await client.query(`
        SELECT * FROM service_categories 
        WHERE is_active = true 
        ORDER BY sort_order ASC, name ASC
      `)
      client.release()
      
      return NextResponse.json({
        data: result.rows,
        total: result.rows.length
      })
    }
    
    return serviceCategoriesCRUD.getList(request)
  } catch (error) {
    console.error('Error fetching service categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { authorized } = await checkAuth()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Check for duplicate slug
    const client = await pool.connect()
    const existing = await client.query(
      'SELECT id FROM service_categories WHERE slug = $1',
      [body.slug]
    )
    
    if (existing.rows.length > 0) {
      body.slug = `${body.slug}-${Date.now()}`
    }
    
    client.release()

    return serviceCategoriesCRUD.create(request)
  } catch (error) {
    console.error('Error creating service category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  return serviceCategoriesCRUD.deleteMany(request)
}
