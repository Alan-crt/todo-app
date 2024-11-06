import { Task, Priority, Status } from '@/types'
import { Draggable } from 'react-beautiful-dnd'

interface TaskItemProps {
  task: Task
  index: number
  onStatusChange: (id: string, status: Status) => void
  onPriorityChange: (id: string, priority: Priority) => void
}

export function TaskItem({ task, index, onStatusChange, onPriorityChange }: TaskItemProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {/* TODO: Implement task item UI */}
        </div>
      )}
    </Draggable>
  )
}