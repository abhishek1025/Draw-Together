import {Request, Response} from 'express';
import {asyncErrorHandler, sendSuccessResponse} from '../helpers';
import {prismaClient, ChatTypeEnum} from '@repo/db/prismaClient';

// GET /chats/room/roomId
export const getChatsByRoomId = asyncErrorHandler(
    async (req: Request, res: Response) => {

        const chatType =  (req.query.chatType as string).toUpperCase() === 'MESSAGE'
                ? ChatTypeEnum.MESSAGE
                : ChatTypeEnum.DRAW


        const roomId = req.params.roomId;

        const chats = await prismaClient.chat.findMany({
            where: {
                roomId,
                chatType: chatType,
            },
            select: {
                id: true,
                chatType: true,
                message: true,
                roomId: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        photo: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        console.log(chats);

        sendSuccessResponse({
            res,
            data: chats,
            message: 'All chats',
        });
    }
);

