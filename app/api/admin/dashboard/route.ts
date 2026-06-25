import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-api-utils'
import { pool } from '@/lib/database'

export async function GET(request: NextRequest) {
  const { authorized } = await checkAuth()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = await pool.connect()

    // Get dashboard statistics
    const stats = await Promise.all([
      // Total counts
      client.query('SELECT COUNT(*) as count FROM blog_posts'),
      client.query('SELECT COUNT(*) as count FROM contact_submissions'),
      client.query('SELECT COUNT(*) as count FROM job_applications'),
      client.query('SELECT COUNT(*) as count FROM services'),
      client.query('SELECT COUNT(*) as count FROM projects'),
      client.query('SELECT COUNT(*) as count FROM testimonials'),
      client.query('SELECT COUNT(*) as count FROM team_members'),
      
      // Recent activity
      client.query('SELECT COUNT(*) as count FROM contact_submissions WHERE submitted_at >= NOW() - INTERVAL \'7 days\''),
      client.query('SELECT COUNT(*) as count FROM job_applications WHERE applied_at >= NOW() - INTERVAL \'7 days\''),
      client.query('SELECT COUNT(*) as count FROM blog_posts WHERE created_at >= NOW() - INTERVAL \'7 days\''),
      
      // Status breakdowns
      client.query('SELECT status, COUNT(*) as count FROM contact_submissions GROUP BY status'),
      client.query('SELECT status, COUNT(*) as count FROM job_applications GROUP BY status'),
      client.query('SELECT is_published, COUNT(*) as count FROM blog_posts GROUP BY is_published'),
      
      // Recent items
      client.query('SELECT id, name, email, subject, submitted_at FROM contact_submissions ORDER BY submitted_at DESC LIMIT 5'),
      client.query('SELECT id, name, email, career_id, applied_at FROM job_applications ORDER BY applied_at DESC LIMIT 5'),
      client.query('SELECT id, title, author, created_at FROM blog_posts ORDER BY created_at DESC LIMIT 5'),
    ])

    const [
      totalPosts, totalContacts, totalApplications, totalServices, totalProjects, totalTestimonials, totalTeamMembers,
      recentContacts, recentApplications, recentPosts,
      contactStatuses, applicationStatuses, postStatuses,
      latestContacts, latestApplications, latestPosts
    ] = stats

    client.release()

    const dashboardData = {
      totals: {
        posts: parseInt(totalPosts.rows[0].count),
        contacts: parseInt(totalContacts.rows[0].count),
        applications: parseInt(totalApplications.rows[0].count),
        services: parseInt(totalServices.rows[0].count),
        projects: parseInt(totalProjects.rows[0].count),
        testimonials: parseInt(totalTestimonials.rows[0].count),
        team_members: parseInt(totalTeamMembers.rows[0].count),
      },
      recent_activity: {
        contacts_this_week: parseInt(recentContacts.rows[0].count),
        applications_this_week: parseInt(recentApplications.rows[0].count),
        posts_this_week: parseInt(recentPosts.rows[0].count),
      },
      status_breakdowns: {
        contacts: contactStatuses.rows.reduce((acc: any, row: any) => {
          acc[row.status] = parseInt(row.count)
          return acc
        }, {}),
        applications: applicationStatuses.rows.reduce((acc: any, row: any) => {
          acc[row.status] = parseInt(row.count)
          return acc
        }, {}),
        posts: postStatuses.rows.reduce((acc: any, row: any) => {
          acc[row.is_published ? 'published' : 'draft'] = parseInt(row.count)
          return acc
        }, {}),
      },
      latest_items: {
        contacts: latestContacts.rows,
        applications: latestApplications.rows,
        posts: latestPosts.rows,
      }
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}