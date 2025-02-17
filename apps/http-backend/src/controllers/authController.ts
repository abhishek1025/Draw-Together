import { Request, Response } from 'express';
import {
  asyncErrorHandler,
  createError,
  sendSuccessResponse,
} from '../helpers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateUserSchema, SignInSchema } from '@repo/common/types';
import { StatusCodes } from 'http-status-codes';

export const signUp = asyncErrorHandler(async (req: Request, res: Response) => {
  const data = CreateUserSchema.safeParse(req.body);

  if (!data.success) {
    createError({
      message: 'Invalid data received',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  sendSuccessResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: 'User created successfully',
  });
});

export const signIn = asyncErrorHandler(async (req: Request, res: Response) => {
  const data = SignInSchema.safeParse(req.body);

  if (!data.success) {
    createError({
      message: 'Invalid data received',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const userId = 1;

  const token = jwt.sign({ userId }, JWT_SECRET);

  sendSuccessResponse({
    res,
    data: {
      token,
    },
  });
});

