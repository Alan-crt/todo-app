import { useState } from 'react'
import { Task } from '@/types'

interface TaskFormProps {
  onSubmit: (task: Partial<Task>) => Promise<void>
  initialData?: Partial<Task>
}

export function TaskForm({ onSubmit, initialData }: TaskFormProps) {
  // TODO: Implement task form with validation
  return (
    <form>
      {/* TODO: Add form fields */}
    </form>
  )
}