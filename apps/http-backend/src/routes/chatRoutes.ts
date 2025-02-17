import { Router } from 'express';
import { authenticateToken } from '../middleware';
import { chatController } from '../controllers';

const chatRouter: Router = Router();

chatRouter
  .route('/room/:roomId')
  .get(authenticateToken, chatController.getChatsByRoomId);

export default chatRouter;

