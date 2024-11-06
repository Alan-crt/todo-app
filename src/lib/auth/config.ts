import { prisma } from '../db';
import { compare, hash } from 'bcryptjs';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export class AuthService {
  async validateCredentials(email: string, password: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user?.password) {
      return null;
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  }

  async createUser(email: string, password: string, name?: string): Promise<AuthUser> {
    const hashedPassword = await hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ?? null
      }
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  }
}

export const authService = new AuthService();