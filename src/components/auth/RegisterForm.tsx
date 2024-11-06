import { useState } from 'react'

interface RegisterFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  return (
    <form>
      {/* TODO: Implement registration form */}
    </form>
  )
}
