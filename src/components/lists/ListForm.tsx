import { useState } from 'react'
import { List } from '@/types'

interface ListFormProps {
  onSubmit: (list: Partial<List>) => Promise<void>
  parentId?: string
  initialData?: Partial<List>
}

export function ListForm({ onSubmit, parentId, initialData }: ListFormProps) {
  return (
    <form>
      {/* TODO: Implement list form */}
    </form>
  )
}