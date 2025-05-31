import { ChatTypeEnum, prismaClient } from "@repo/db/prismaClient";
import { userManager } from "../state/userManager";
// @ts-ignore
import { MessageType } from "@repo/common/messageTypeConstant";

export async function deleteChat(data: any) {
  const chatId = data.chatId;
  const roomId = data.roomId;

  await prismaClient.chat.delete({
    where: {
      id: chatId,
    },
  });

  userManager.getUsersInRoom(roomId).forEach((user) => {
    user.ws.send(
      JSON.stringify({
        type: data.type,
        chatId,
        roomId,
      }),
    );
  });
}

export async function sendChatMessage(data: any, userId: string) {
  const roomId = data.roomId;
  const message = data.message;

  const [chat, _user] = await Promise.all([
    prismaClient.chat.create({
      data: {
        roomId,
        message,
        userId,
        chatType:
          data.type === "chat_message"
            ? ChatTypeEnum.MESSAGE
            : ChatTypeEnum.DRAW,
      },
    }),

    prismaClient.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        photo: true,
      },
    }),
  ]);

  userManager.getUsersInRoom(roomId).forEach((user) => {
    user.ws.send(
      JSON.stringify({
        type: data.type,
        message:
          data.type === "chat_draw"
            ? JSON.stringify({
                id: chat.id,
                ...JSON.parse(message),
              })
            : message,
        roomId,
        user: JSON.stringify(_user),
      }),
    );
  });
}

export async function updateDraw(data: any) {
  const roomId = data.roomId;
  const message = JSON.parse(data.message);

  await prismaClient.chat.update({
    where: {
      id: message.id,
    },
    data: {
      message: data.message,
    },
  });

  userManager.getUsersInRoom(roomId).forEach((user) => {
    user.ws.send(JSON.stringify(data));
  });
}

export async function deleteAllDraws(data: any) {
  const roomId = data.roomId;

  await prismaClient.chat.deleteMany({
    where: {
      roomId: roomId,
      chatType: ChatTypeEnum.DRAW,
    },
  });

  userManager.getUsersInRoom(roomId).forEach((user) => {
    user.ws.send(
      JSON.stringify({
        type: MessageType.DELETE_DRAWS,
      }),
    );
  });
}
