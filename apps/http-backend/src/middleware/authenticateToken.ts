import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { MyJwtPayload } from '../types';
import { StatusCodes } from 'http-status-codes';
import { JWT_SECRET } from '@repo/backend-common/config';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization'] ?? '';

  const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;

  if (decoded) {
    req.userId = decoded.userId;
    next();
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Authentication failed',
    });
  }
};

