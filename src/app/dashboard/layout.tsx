// src/app/dashboard/layout.tsx
import { auth } from '@/lib/auth/auth'
import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Implement authentication check
  // TODO: Fetch user data and lists

  return (
    <div className="h-screen flex">
      {/* TODO: Add Sidebar component */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TODO: Add DashboardNav component */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}