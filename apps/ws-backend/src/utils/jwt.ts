import jwt, { JwtPayload } from 'jsonwebtoken';

export const validateJwtToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '');

    if (typeof decoded === 'string') return null;

    return (decoded as JwtPayload).userId;
  } catch (error) {
    return null;
  }
};

