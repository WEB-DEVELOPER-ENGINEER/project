import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { pool } from '@/lib/database'
import { BlogPost } from '@/lib/types'
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

export async function GET(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('perPage') || '10')
  const sort = searchParams.get('sort') || 'id'
  const order = searchParams.get('order') || 'ASC'
  const filter = searchParams.get('filter')

  try {
    const client = await pool.connect()
    
    let whereClause = ''
    let queryParams: any[] = []
    let paramIndex = 1

    if (filter) {
      const filterObj = JSON.parse(filter)
      if (filterObj.q) {
        whereClause = `WHERE title ILIKE $${paramIndex} OR content ILIKE $${paramIndex}`
        queryParams.push(`%${filterObj.q}%`)
        paramIndex++
      }
    }

    // Get total count
    const countResult = await client.query(
      `SELECT COUNT(*) FROM blog_posts ${whereClause}`,
      queryParams
    )
    const total = parseInt(countResult.rows[0].count)

    // Get paginated data
    const offset = (page - 1) * perPage
    const dataResult = await client.query(
      `SELECT * FROM blog_posts ${whereClause} ORDER BY ${sort} ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, perPage, offset]
    )

    client.release()

    const posts = dataResult.rows.map((post: any) => ({
      ...post,
      published_date: post.published_date?.toISOString().split('T')[0],
    }))

    return NextResponse.json({
      data: posts,
      total,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
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
      excerpt,
      og_image,
      twitter_image,
      tags,
      related_services,
      related_projects,
      featured,
      reading_time,
      author_id,
      category_id,
    } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, slug, and content are required' 
      }, { status: 400 })
    }

    // Ensure description is not empty (use excerpt or auto-generate from content)
    let finalDescription = description
    if (!finalDescription || finalDescription.trim() === '') {
      if (excerpt && excerpt.trim() !== '') {
        finalDescription = excerpt
      } else {
        // Auto-generate description from content (first 160 characters)
        const textContent = content.replace(/<[^>]*>/g, '').trim()
        finalDescription = textContent.length > 160 
          ? textContent.substring(0, 160) + '...'
          : textContent || 'Blog post description'
      }
    }

    // Sanitize HTML content
    const sanitizedContent = purify.sanitize(content)

    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO blog_posts (
        title, slug, description, content, image_url, author, published_date, 
        is_published, meta_title, meta_description, excerpt, og_image, twitter_image,
        tags, related_services, related_projects, featured, reading_time, author_id, category_id
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
       RETURNING *`,
      [
        title,
        slug,
        finalDescription,
        sanitizedContent,
        image_url,
        author || 'JUSOR Team',
        published_date || new Date().toISOString().split('T')[0],
        is_published !== undefined ? is_published : true,
        meta_title,
        meta_description,
        excerpt,
        og_image,
        twitter_image,
        tags || [],
        related_services || [],
        related_projects || [],
        featured || false,
        reading_time,
        author_id,
        category_id,
      ]
    )
    client.release()

    const post = {
      ...result.rows[0],
      published_date: result.rows[0].published_date?.toISOString().split('T')[0],
    }

    return NextResponse.json({ data: post })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}