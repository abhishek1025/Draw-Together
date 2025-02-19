import { Router } from 'express';
import { authenticateToken } from '../middleware';
import { chatController } from '../controllers';

const chatRouter: Router = Router();

chatRouter.route('/room/:roomId').get(chatController.getChatsByRoomId);

export default chatRouter;

