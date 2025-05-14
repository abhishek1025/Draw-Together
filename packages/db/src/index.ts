import { PrismaClient, ChatType } from '@prisma/client';

export const prismaClient = new PrismaClient();
export const ChatTypeEnum = ChatType;
