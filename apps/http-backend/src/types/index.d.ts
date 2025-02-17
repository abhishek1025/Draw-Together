import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

import express from 'express';

export interface TokenPayload {
  userId?: string;
}

export interface MyJwtPayload extends TokenPayload, JwtPayload {}

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

