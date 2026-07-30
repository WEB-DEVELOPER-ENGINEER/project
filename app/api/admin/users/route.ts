import { NextRequest } from 'next/server'
import { AdminCRUD } from '@/lib/admin-api-utils'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-api-utils'
import { pool } from '@/lib/database'

const usersCRUD = new AdminCRUD(
  'admin_users',
  ['email', 'name', 'role', 'is_active'],
  ['email', 'name'],
  ['email', 'name']
)

function stripPasswordHash(record: any) {
  if (record && typeof record === 'object') {
    const { password_hash, ...safe } = record
    return safe
  }
  return record
}

export async function GET(request: NextRequest) {
  const response = await usersCRUD.getList(request)
  const body = await response.json()
  if (Array.isArray(body.data)) {
    body.data = body.data.map(stripPasswordHash)
  }
  return NextResponse.json(body, { status: response.status })
}

export async function POST(request: NextRequest) {
  const { authorized } = await checkAuth('super_admin')
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, name, password, role = 'admin', is_active = true } = body

    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Email, name, and password are required' }, { status: 400 })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    const client = await pool.connect()
    
    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM admin_users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      client.release()
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const result = await client.query(
      'INSERT INTO admin_users (email, name, password_hash, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, role, is_active, created_at',
      [email, name, password_hash, role, is_active]
    )
    client.release()

    return NextResponse.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}