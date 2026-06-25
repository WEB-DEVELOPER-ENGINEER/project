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

export async function GET(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('perPage') || '10')
  const sort = searchParams.get('sort') || 'display_order'
  const order = searchParams.get('order') || 'ASC'
  const filter = searchParams.get('filter')

  try {
    const client = await pool.connect()
    
    let whereClause = 'WHERE 1=1'
    let queryParams: any[] = []
    let paramIndex = 1

    if (filter) {
      const filterObj = JSON.parse(filter)
      if (filterObj.q) {
        whereClause += ` AND (metric_key ILIKE $${paramIndex} OR metric_label ILIKE $${paramIndex})`
        queryParams.push(`%${filterObj.q}%`)
        paramIndex++
      }
      if (filterObj.category) {
        whereClause += ` AND category = $${paramIndex}`
        queryParams.push(filterObj.category)
        paramIndex++
      }
      if (filterObj.is_active !== undefined) {
        whereClause += ` AND is_active = $${paramIndex}`
        queryParams.push(filterObj.is_active)
        paramIndex++
      }
    }

    // Get total count
    const countResult = await client.query(
      `SELECT COUNT(*) FROM company_metrics ${whereClause}`,
      queryParams
    )
    const total = parseInt(countResult.rows[0].count)

    // Get paginated data
    const offset = (page - 1) * perPage
    const dataResult = await client.query(
      `SELECT * FROM company_metrics ${whereClause} ORDER BY ${sort} ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, perPage, offset]
    )

    client.release()

    return NextResponse.json({
      data: dataResult.rows,
      total,
    })
  } catch (error) {
    console.error('Error fetching company metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
      `INSERT INTO company_metrics (metric_key, metric_value, metric_label, metric_description, category, icon_name, color_class, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        metric_key,
        metric_value,
        metric_label,
        metric_description,
        category,
        icon_name,
        color_class,
        display_order || 0,
        is_active !== undefined ? is_active : true,
      ]
    )
    client.release()

    return NextResponse.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Error creating company metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}