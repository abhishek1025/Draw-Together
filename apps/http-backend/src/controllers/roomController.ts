import { Request, Response } from 'express';
import {
  asyncErrorHandler,
  createError,
  sendSuccessResponse,
} from '../helpers';
import { CreateRoomSchema } from '@repo/common/types';
import { StatusCodes } from 'http-status-codes';
import { prismaClient } from '@repo/db/prismaClient';

// POST /rooms
export const createRoom = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const createRoomSchema = CreateRoomSchema.safeParse(req.body);

    if (!createRoomSchema.success) {
      createError({
        message: 'Invalid data received',
        statusCode: StatusCodes.BAD_REQUEST,
      });
      return;
    }

    await prismaClient.room.create({
      data: {
        slug: createRoomSchema.data.slug,
        userId: req.userId,
      },
    });

    sendSuccessResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: 'New room created',
    });
  }
);

// GET /rooms
export const getAllRooms = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const rooms = await prismaClient.room.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
          },
        },
      },
    });

    sendSuccessResponse({
      res,
      data: rooms,
      message: 'All rooms fetched successfully',
    });
  }
);

// GET /rooms/user/:userId
export const getRoomsByUserId = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const rooms = await prismaClient.room.findMany({
      where: {
        userId: req.params.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
          },
        },
      },
    });

    sendSuccessResponse({
      res,
      data: rooms,
      message: 'All rooms fetched successfully',
    });
  }
);

