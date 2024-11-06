// src/app/dashboard/lists/[listId]/page.tsx
import { notFound } from 'next/navigation'
import { TaskList } from '@/components/tasks/TaskList'
import { ListHeader } from '@/components/lists/ListHeader'

interface ListPageProps {
  params: {
    listId: string
  }
}

export default async function ListPage({ params }: ListPageProps) {
  // TODO: Fetch list details
  // TODO: Check user permissions for list
  // TODO: Fetch tasks for list

  return (
    <div className="container mx-auto px-4 py-6">
      {/* TODO: Add ListHeader component */}
      {/* TODO: Add TaskList component */}
      {/* TODO: Add sharing controls */}
      {/* TODO: Add list settings */}
    </div>
  )
}