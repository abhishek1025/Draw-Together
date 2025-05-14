import { Game } from '../Game';

export function initMouseHandlers(game: Game) {
  game.canvas.addEventListener('mousedown', game.mouseDownHandler);
  game.canvas.addEventListener('mouseup', game.mouseUpHandler);
  game.canvas.addEventListener('mousemove', game.mouseMoveHandler);
  game.canvas.addEventListener('click', game.clickHandler);
}

export function destroyMouseHandlers(game: Game) {
  game.canvas.removeEventListener('mousedown', game.mouseDownHandler);
  game.canvas.removeEventListener('mouseup', game.mouseUpHandler);
  game.canvas.removeEventListener('mousemove', game.mouseMoveHandler);
  game.canvas.removeEventListener('click', game.clickHandler);
}

