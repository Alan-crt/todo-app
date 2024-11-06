import { Task } from '@/types'

interface CalendarTaskCardProps {
  task: Task
  onClick: (taskId: string) => void
}

export function CalendarTaskCard({ task, onClick }: CalendarTaskCardProps) {
  return (
    <div>
      {/* TODO: Implement calendar task card */}
    </div>
  )
}