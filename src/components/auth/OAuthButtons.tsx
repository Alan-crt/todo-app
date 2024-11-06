import { signIn } from 'next-auth/react'

interface OAuthButtonsProps {
  callbackUrl?: string
}

export function OAuthButtons({ callbackUrl }: OAuthButtonsProps) {
  return (
    <div>
      {/* TODO: Implement OAuth provider buttons */}
    </div>
  )
}