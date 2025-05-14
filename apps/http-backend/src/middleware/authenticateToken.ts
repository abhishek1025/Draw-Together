import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { MyJwtPayload } from '../types';
import { StatusCodes } from 'http-status-codes';
import { JWT_SECRET } from '@repo/backend-common/config';
import { asyncErrorHandler } from '../helpers';

export const authenticateToken = asyncErrorHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'] ?? '';

    const decoded: JwtPayload = jwt.verify(
      token?.split(' ')[1] ?? '',
      JWT_SECRET
    ) as JwtPayload;

    if (decoded?.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Authentication failed',
      });
    }
  }
);

