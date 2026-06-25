import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { pool } from '@/lib/database'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// Create DOMPurify instance for server-side
const window = new JSDOM('').window
const purify = DOMPurify(window as any)

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
      'SELECT * FROM blog_posts WHERE id = $1',
      [params.id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const post = {
      ...result.rows[0],
      published_date: result.rows[0].published_date?.toISOString().split('T')[0],
    }

    return NextResponse.json({ data: post })
  } catch (error) {
    console.error('Error fetching post:', error)
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
      title,
      slug,
      description,
      content,
      image_url,
      author,
      published_date,
      is_published,
      meta_title,
      meta_description,
    } = body

    // Sanitize HTML content
    const sanitizedContent = purify.sanitize(content)

    const client = await pool.connect()
    const result = await client.query(
      `UPDATE blog_posts 
       SET title = $1, slug = $2, description = $3, content = $4, image_url = $5, 
           author = $6, published_date = $7, is_published = $8, meta_title = $9, 
           meta_description = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [
        title,
        slug,
        description,
        sanitizedContent,
        image_url,
        author,
        published_date,
        is_published,
        meta_title,
        meta_description,
        params.id,
      ]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const post = {
      ...result.rows[0],
      published_date: result.rows[0].published_date?.toISOString().split('T')[0],
    }

    return NextResponse.json({ data: post })
  } catch (error) {
    console.error('Error updating post:', error)
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
      'DELETE FROM blog_posts WHERE id = $1 RETURNING *',
      [params.id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const post = {
      ...result.rows[0],
      published_date: result.rows[0].published_date?.toISOString().split('T')[0],
    }

    return NextResponse.json({ data: post })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}