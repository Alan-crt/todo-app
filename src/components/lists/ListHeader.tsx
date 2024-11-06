import { List, PermissionLevel } from '@/types'

interface ListHeaderProps {
  list: List
  userPermission: PermissionLevel
  onShare: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ListHeader({ list, userPermission, onShare, onEdit, onDelete }: ListHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      {/* TODO: Implement list header with actions */}
    </div>
  )
}