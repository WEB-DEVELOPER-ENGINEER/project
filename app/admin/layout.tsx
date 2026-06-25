import { SessionProvider } from '@/components/providers/SessionProvider'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="admin-layout">
        {children}
      </div>
    </SessionProvider>
  )
}