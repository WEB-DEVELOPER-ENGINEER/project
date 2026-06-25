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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return projectsCRUD.getOne(params.id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return projectsCRUD.update(params.id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return projectsCRUD.delete(params.id)
}