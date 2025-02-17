import { Router } from 'express';
import { authenticateToken } from '../middleware';
import { roomController } from '../controllers';

const roomRoutes: Router = Router();

roomRoutes.route('/').post(authenticateToken, roomController.createRoom);

export default roomRoutes;

