import { authService } from '@/lib/auth/config';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await authService.validateCredentials(email, password);
    
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    // Set authentication cookie
    (await
          // Set authentication cookie
          cookies()).set('auth-token', 'your-jwt-token-here', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return new Response(
      JSON.stringify({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name 
        } 
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}