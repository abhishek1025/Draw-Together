import { MessageType } from '@repo/common/messageTypeConstant';
import { Game } from '../Game';

export function setupSocketHandlers(game: Game) {
  game.socket.onmessage = event => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case MessageType.CHAT_DRAW:
        const parsedData = JSON.parse(message.message);
        game.existingShapes.push(parsedData);
        break;

      case MessageType.ERASE_DRAW:
        game.existingShapes = game.existingShapes.filter(
          s => s.id !== message.chatId
        );
        break;
    }

    game.clearCanvas();
  };
}

