import { Router } from 'express';
import { authenticateToken } from '../middleware';
import { roomController } from '../controllers';

const roomRoutes: Router = Router();

roomRoutes
  .route('/')
  .post(authenticateToken, roomController.createRoom)
  .get(roomController.getAllRooms);

roomRoutes.route('/user/:userId').get(roomController.getRoomsByUserId);

roomRoutes.route('/slug/:slug').get(roomController.getRoomDetailsBySlug);

export default roomRoutes;

