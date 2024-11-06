import { useState } from 'react'
import { List, PermissionLevel } from '@/types'

interface ShareListDialogProps {
  list: List
  onShare: (email: string, permission: PermissionLevel) => Promise<void>
  onClose: () => void
}

export function ShareListDialog({ list, onShare, onClose }: ShareListDialogProps) {
  return (
    <div>
      {/* TODO: Implement sharing dialog */}
    </div>
  )
}