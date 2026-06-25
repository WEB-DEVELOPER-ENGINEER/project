import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { pool } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await pool.connect()
    const result = await client.query(
      'SELECT id, email, name, role, is_active, last_login FROM admin_users WHERE email = $1 AND is_active = true',
      [session.user.email]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}