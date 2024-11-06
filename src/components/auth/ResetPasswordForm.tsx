import { useState } from 'react'

interface ResetPasswordFormProps {
  token: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function ResetPasswordForm({ token, onSuccess, onError }: ResetPasswordFormProps) {
  return (
    <form>
      {/* TODO: Implement password reset form */}
    </form>
  )
}