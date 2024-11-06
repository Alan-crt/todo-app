import { Task } from '@/types'

interface DateCellProps {
  date: Date
  tasks: Task[]
  onAddTask: (date: Date) => void
}

export function DateCell({ date, tasks, onAddTask }: DateCellProps) {
  return (
    <div>
      {/* TODO: Implement calendar date cell */}
    </div>
  )
}