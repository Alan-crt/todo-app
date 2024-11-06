import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background
            ${error ? 'border-destructive' : 'border-input'}
            ${className}`}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-destructive mt-1">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
