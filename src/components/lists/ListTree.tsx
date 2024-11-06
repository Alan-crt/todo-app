import { List } from '@/types'
import { ListItem } from './ListItem'

interface ListTreeProps {
  lists: List[]
  selectedListId?: string
  onSelect: (listId: string) => void
}

export function ListTree({ lists, selectedListId, onSelect }: ListTreeProps) {
  // TODO: Implement recursive list tree structure
  return (
    <div className="space-y-1">
      {/* TODO: Render nested lists */}
    </div>
  )
}