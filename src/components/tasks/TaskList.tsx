import { TaskItem } from './TaskItem'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Task } from '@/types'

interface TaskListProps {
  tasks: Task[]
  onReorder: (startIndex: number, endIndex: number) => void
}

export function TaskList({ tasks, onReorder }: TaskListProps) {
  return (
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {/* TODO: Implement task list with drag and drop */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}