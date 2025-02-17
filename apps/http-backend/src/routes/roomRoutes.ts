import { Router } from 'express';
import { authenticateToken } from '../middleware';
import { roomController } from '../controllers';

const roomRoutes: Router = Router();

roomRoutes
  .route('/')
  .post(authenticateToken, roomController.createRoom)
  .get(authenticateToken, roomController.getAllRooms);

roomRoutes
  .route('/user/:userId')
  .get(authenticateToken, roomController.getRoomsByUserId);

export default roomRoutes;

