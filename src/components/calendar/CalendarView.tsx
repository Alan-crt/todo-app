import { Task } from '@/types'
import { FullCalendar } from '@fullcalendar/react'

interface CalendarViewProps {
  tasks: Task[]
  onDateSelect: (date: Date) => void
  onEventClick: (taskId: string) => void
}

export function CalendarView({ tasks, onDateSelect, onEventClick }: CalendarViewProps) {
  return (
    <div>
      {/* TODO: Implement calendar view with FullCalendar */}
    </div>
  )
}
