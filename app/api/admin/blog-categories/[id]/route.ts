import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { pool } from '@/lib/database'

async function checkAuth() {
  const session = await getServerSession()
  if (!session?.user) {
    return false
  }
  return true
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = await pool.connect()
    const result = await client.query(
      'SELECT * FROM blog_categories WHERE id = $1',
      [params.id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Blog category not found' }, { status: 404 })
    }

    return NextResponse.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Error fetching blog category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      color,
      icon_name,
      is_active,
      sort_order,
    } = body

    const client = await pool.connect()
    const result = await client.query(
      `UPDATE blog_categories SET 
       name = $1, slug = $2, description = $3, color = $4, icon_name = $5,
       is_active = $6, sort_order = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [
        name,
        slug,
        description,
        color,
        icon_name,
        is_active !== undefined ? is_active : true,
        sort_order || 0,
        params.id,
      ]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Blog category not found' }, { status: 404 })
    }

    return NextResponse.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Error updating blog category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = await pool.connect()
    const result = await client.query(
      'DELETE FROM blog_categories WHERE id = $1 RETURNING *',
      [params.id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Blog category not found' }, { status: 404 })
    }

    return NextResponse.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Error deleting blog category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}