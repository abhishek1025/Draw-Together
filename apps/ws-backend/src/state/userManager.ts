import { WebSocket } from "ws";
import { User } from "../types";

class UserManager {
  private users: User[] = [];

  getUser(ws: WebSocket) {
    return this.users.find((x) => x.ws === ws);
  }

  addUser({ userId, ws }: { userId: string; ws: WebSocket }) {
    this.users.push({
      userId,
      rooms: [],
      ws,
    });
  }

  joinRoom({ ws, roomId }: { roomId: string; ws: WebSocket }): string | null {
    const user = this.getUser(ws);

    if (!user) return null;

    user.rooms.push(roomId);

    return user.userId;
  }

  leaveRoom({ ws, roomId }: { roomId: string; ws: WebSocket }): string | null {
    const user = this.getUser(ws);

    if (!user) return null;

    user.rooms = user.rooms.filter((x) => x === roomId);

    if (user.rooms.length === 0) {
      this.users = this.users.filter((x) => x.ws !== ws);
    }

    return user.userId;
  }

  getUsersInRoom(roomId: string) {
    return this.users.filter((user) => user.rooms.includes(roomId));
  }
}

export const userManager = new UserManager();
