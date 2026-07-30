import { NextRequest, NextResponse } from 'next/server'
import { AdminCRUD, checkAuth } from '@/lib/admin-api-utils'
import { pool } from '@/lib/database'
import bcrypt from 'bcryptjs'

const usersCRUD = new AdminCRUD(
  'admin_users',
  ['email', 'name', 'role', 'is_active'],
  ['email', 'name'],
  ['email', 'name']
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const response = await usersCRUD.getOne(params.id)
  const body = await response.json()
  if (body?.data && typeof body.data === 'object') {
    const { password_hash, ...safe } = body.data
    body.data = safe
  }
  return NextResponse.json(body, { status: response.status })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await checkAuth('super_admin')
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { password, ...otherFields } = body

    // If password is being updated, hash it
    if (password) {
      const password_hash = await bcrypt.hash(password, 12)
      otherFields.password_hash = password_hash
    }

    // Filter allowed fields
    const allowedFields = ['email', 'name', 'role', 'is_active', 'password_hash']
    const data: any = {}
    allowedFields.forEach(field => {
      if (otherFields[field] !== undefined) {
        data[field] = otherFields[field]
      }
    })

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const fields = Object.keys(data)
    const values = Object.values(data)
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ')

    const client = await pool.connect()
    const result = await client.query(
      `UPDATE admin_users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, email, name, role, is_active, created_at, updated_at`,
      [...values, params.id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await checkAuth('super_admin')
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return usersCRUD.delete(params.id)
}