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
      'SELECT * FROM company_metrics WHERE id = $1',
      [params.id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Company metric not found' }, { status: 404 })
    }

    return NextResponse.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Error fetching company metric:', error)
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
      metric_key,
      metric_value,
      metric_label,
      metric_description,
      category,
      icon_name,
      color_class,
      display_order,
      is_active,
    } = body

    const client = await pool.connect()
    const result = await client.query(
      `UPDATE company_metrics SET 
       metric_key = $1, metric_value = $2, metric_label = $3, metric_description = $4,
       category = $5, icon_name = $6, color_class = $7, display_order = $8, is_active = $9,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`,
      [
        metric_key,
        metric_value,
        metric_label,
        metric_description,
        category,
        icon_name,
        color_class,
        display_order,
        is_active,
        params.id,
      ]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Company metric not found' }, { status: 404 })
    }

    return NextResponse.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Error updating company metric:', error)
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
      'DELETE FROM company_metrics WHERE id = $1 RETURNING *',
      [params.id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Company metric not found' }, { status: 404 })
    }

    return NextResponse.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Error deleting company metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}