'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetList } from 'react-admin'
import { 
  Users, 
  MessageSquare, 
  Briefcase, 
  FileText, 
  Settings,
  TrendingUp,
  Eye,
  Calendar
} from 'lucide-react'

interface DashboardStats {
  totals: {
    posts: number
    contacts: number
    applications: number
    services: number
    projects: number
    testimonials: number
    team_members: number
  }
  recent_activity: {
    contacts_this_week: number
    applications_this_week: number
    posts_this_week: number
  }
  status_breakdowns: {
    contacts: Record<string, number>
    applications: Record<string, number>
    posts: Record<string, number>
  }
  latest_items: {
    contacts: any[]
    applications: any[]
    posts: any[]
  }
}

const StatCard = ({ title, value, icon: Icon, trend }: {
  title: string
  value: number
  icon: any
  trend?: number
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend !== undefined && (
        <p className="text-xs text-muted-foreground">
          <span className={trend >= 0 ? 'text-green-600' : 'text-red-600'}>
            {trend >= 0 ? '+' : ''}{trend}
          </span>
          {' '}from last week
        </p>
      )}
    </CardContent>
  </Card>
)

export const Dashboard = () => {
  const { data: dashboardData, isLoading } = useGetList('dashboard', {
    pagination: { page: 1, perPage: 1 },
    sort: { field: 'id', order: 'ASC' },
    filter: {}
  });

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  const stats = dashboardData?.[0]

  if (!stats) {
    return <div className="p-6">No dashboard data available</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin panel</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Blog Posts"
          value={stats.totals.posts}
          icon={FileText}
          trend={stats.recent_activity.posts_this_week}
        />
        <StatCard
          title="Contact Submissions"
          value={stats.totals.contacts}
          icon={MessageSquare}
          trend={stats.recent_activity.contacts_this_week}
        />
        <StatCard
          title="Services"
          value={stats.totals.services}
          icon={Settings}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Projects"
          value={stats.totals.projects}
          icon={Briefcase}
        />
        <StatCard
          title="Testimonials"
          value={stats.totals.testimonials}
          icon={MessageSquare}
        />
        <StatCard
          title="Team Members"
          value={stats.totals.team_members}
          icon={Users}
        />
      </div>

      {/* Status Breakdowns */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Contact Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.status_breakdowns.contacts).map(([status, count]) => (
                <div key={status} className="flex justify-between">
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Post Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.status_breakdowns.posts).map(([status, count]) => (
                <div key={status} className="flex justify-between">
                  <span className="capitalize">{status}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.latest_items.contacts.map((contact: any) => (
                <div key={contact.id} className="flex flex-col space-y-1">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-muted-foreground">{contact.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(contact.submitted_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.latest_items.posts.map((post: any) => (
                <div key={post.id} className="flex flex-col space-y-1">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-sm text-muted-foreground">by {post.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}