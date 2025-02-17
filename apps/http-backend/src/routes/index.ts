import { Router } from 'express';
import authRoutes from './authRoutes';
import roomRoutes from './roomRoutes';
import chatRouter from './chatRoutes';

const appRoutes: Router = Router();

appRoutes.use('/auth', authRoutes);
appRoutes.use('/rooms', roomRoutes);
appRoutes.use('/chats', chatRouter);

export default appRoutes;

