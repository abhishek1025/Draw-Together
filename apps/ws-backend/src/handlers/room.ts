import { WebSocket } from "ws";
import { userManager } from "../state/userManager";
import { prismaClient } from "@repo/db/prismaClient";
// @ts-ignore
import { MessageType } from "@repo/common/messageTypeConstant";

export async function joinRoom(roomId: string, ws: WebSocket) {
  const userId = userManager.joinRoom({
    ws,
    roomId,
  });

  if (!userId) return;

  const activeUsersInRoom = userManager.getUsersInRoom(roomId);

  const uniqueActiveUsersId = Array.from(
    new Set(activeUsersInRoom.map((u) => u.userId)),
  );

  const activeUsers = await Promise.all([
    ...uniqueActiveUsersId.map((userId) =>
      prismaClient.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          photo: true,
          email: true,
        },
      }),
    ),
  ]);

  if (!activeUsers) return;

  activeUsersInRoom.forEach((u) => {
    u.ws.send(
      JSON.stringify({
        type: MessageType.JOIN_ROOM,
        activeUsers: JSON.stringify(activeUsers),
      }),
    );
  });
}

export function leaveRoom(roomId: string, ws: WebSocket) {
  const userId = userManager.leaveRoom({
    ws,
    roomId,
  });

  if (!userId) return;

  console.log(userId);

  userManager.getUsersInRoom(roomId).forEach((u) => {
    u.ws.send(
      JSON.stringify({
        type: MessageType.LEAVE_ROOM,
        userId,
      }),
    );
  });
}
