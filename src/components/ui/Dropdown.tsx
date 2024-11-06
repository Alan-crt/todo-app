import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'

const dropdownVariants = cva(
  'relative inline-block text-left',
  {
    variants: {
      align: {
        start: 'origin-top-left left-0',
        center: 'origin-top',
        end: 'origin-top-right right-0',
      },
    },
    defaultVariants: {
      align: 'center',
    },
  }
)

export interface DropdownProps extends VariantProps<typeof dropdownVariants> {
  trigger: React.ReactNode
  children: React.ReactNode
}

export function Dropdown({ align, trigger, children }: DropdownProps) {
  return (
    <div className={dropdownVariants({ align })}>
      {/* TODO: Implement dropdown menu */}
    </div>
  )
}