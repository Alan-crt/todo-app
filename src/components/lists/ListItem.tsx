import { List } from '@/types'

interface ListItemProps {
  list: List
  isSelected: boolean
  onSelect: (listId: string) => void
  depth: number
}

export function ListItem({ list, isSelected, onSelect, depth }: ListItemProps) {
  return (
    <div style={{ paddingLeft: `${depth * 1.5}rem` }}>
      {/* TODO: Implement list item UI */}
    </div>
  )
}