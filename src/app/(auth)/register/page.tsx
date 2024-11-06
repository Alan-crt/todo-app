// src/app/(auth)/register/page.tsx
import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
  // TODO: Check if user is already authenticated
  // If yes, redirect to dashboard

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* TODO: Add RegisterForm component */}
        {/* TODO: Add OAuth providers */}
        {/* TODO: Add terms of service acceptance */}
      </div>
    </div>
  )
}