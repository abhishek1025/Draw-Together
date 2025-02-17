import { Request, Response } from 'express';
import {
  asyncErrorHandler,
  createError,
  sendSuccessResponse,
} from '../helpers';
import { CreateRoomSchema } from '@repo/common/types';
import { StatusCodes } from 'http-status-codes';

export const createRoom = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const data = CreateRoomSchema.safeParse(req.body);

    if (!data.success) {
      createError({
        message: 'Invalid data received',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    sendSuccessResponse({
      res,
      data: {
        roomId: 1,
      },
      message: 'New room created',
    });
  }
);

