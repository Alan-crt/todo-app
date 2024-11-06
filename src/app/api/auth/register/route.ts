import { authService } from '@/lib/auth/config';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User already exists' }),
        { status: 409 }
      );
    }

    // Create new user
    const user = await authService.createUser(email, password, name);

    return new Response(
      JSON.stringify({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name 
        } 
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}