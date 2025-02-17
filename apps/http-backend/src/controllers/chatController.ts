import { Request, Response } from 'express';
import { asyncErrorHandler, sendSuccessResponse } from '../helpers';
import { prismaClient } from '@repo/db/prismaClient';

// GET /chats/room/roomId
export const getChatsByRoomId = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const roomId = req.params.roomId;

    const chats = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    sendSuccessResponse({
      res,
      data: chats,
      message: 'All chats',
    });
  }
);

