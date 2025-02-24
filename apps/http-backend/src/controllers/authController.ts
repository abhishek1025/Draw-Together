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
import { prismaClient } from '@repo/db/prismaClient';
import { hashPassword } from '../utils';
import bcrypt from 'bcrypt';

// POST /auth/sign-up
export const signUp = asyncErrorHandler(async (req: Request, res: Response) => {
  const isCreateUserDataValid = await CreateUserSchema.isValid(req.body);

  if (!isCreateUserDataValid) {
    createError({
      message: 'Invalid data received',
      statusCode: StatusCodes.CONFLICT,
    });
    return;
  }

  const isUserExist = await prismaClient.user.findFirst({
    where: {
      email: req.body?.email,
    },
  });

  if (isUserExist) {
    createError({
      message: 'User already exists with this email',
      statusCode: StatusCodes.BAD_REQUEST,
    });
    return;
  }

  const hashedPassword = await hashPassword(req.body.password);

  // Create a new user
  await prismaClient.user.create({
    data: {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.email,
    },
  });

  sendSuccessResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: 'User created successfully',
  });
});

// POST /auth/sign-in
export const signIn = asyncErrorHandler(async (req: Request, res: Response) => {

  const isSignInDataValid = await SignInSchema.isValid(req.body);

  if (!isSignInDataValid) {
    createError({
      message: 'Invalid data received',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: req.body?.email,
    },
  });

  const isPasswordValid = await bcrypt.compare(
    req.body?.password ?? '',
    user?.password ?? ''
  );

  if (!user || !isPasswordValid) {
    createError({
      message: 'Username or password incorrect',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const token = jwt.sign({ userId: user?.id }, JWT_SECRET, {
    expiresIn: '7d',
  });

  sendSuccessResponse({
    res,
    data: {
      token,
    },
  });
});

