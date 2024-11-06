import { Task } from '@/types'

interface TaskDetailsProps {
  task: Task
  onUpdate: (task: Task) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TaskDetails({ task, onUpdate, onDelete }: TaskDetailsProps) {
  return (
    <div>
      {/* TODO: Implement detailed task view */}
    </div>
  )
}