import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn: '7d', // Token expires in 7 days
      },
      (err, token) => {
        if (err) reject(err);
        else if (token) resolve(token);
        else reject(new Error('Failed to sign JWT'));
      }
    );
  });
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    return await new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded as JWTPayload);
      });
    });
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}