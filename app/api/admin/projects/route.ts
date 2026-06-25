import { NextRequest } from 'next/server'
import { AdminCRUD, generateSlug, checkAuth } from '@/lib/admin-api-utils'
import { NextResponse } from 'next/server'
import { pool } from '@/lib/database'
const projectsCRUD = new AdminCRUD(
  'projects',
  [
    'title', 'description', 'slug', 'sort_order', 'is_active',
    'category', 'status', 'project_date', 'languages', 'industry',
    'team_size', 'word_count', 'duration_days', 'challenge', 'solution',
    'scope', 'deliverables', 'technical_details', 'process_details',
    'quality_metrics', 'certifications', 'key_metrics', 'impact_outcomes',
    'client_testimonial', 'achievements', 'timeline_phases', 'meta_title',
    'meta_description'
  ],
  ['title', 'description'],
  ['title', 'description', 'category', 'industry'],
  ['description', 'challenge', 'solution']
)

export async function GET(request: NextRequest) {
  return projectsCRUD.getList(request)
}

export async function POST(request: NextRequest) {
  const { authorized } = await checkAuth()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title)
    }

    // Check for duplicate slug
    if (body.slug) {
      const client = await pool.connect()
      const existing = await client.query(
        'SELECT id FROM projects WHERE slug = $1',
        [body.slug]
      )
      client.release()

      if (existing.rows.length > 0) {
        body.slug = `${body.slug}-${Date.now()}`
      }
    }

    return projectsCRUD.create(new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: request.headers
    }))
  } catch (error) {
    console.error('Error creating projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  return projectsCRUD.deleteMany(request)
}