import { Router } from 'express';
import authRoutes from './authRoutes';
import roomRoutes from './roomRoutes';

const appRoutes: Router = Router();

appRoutes.use('/auth', authRoutes);
appRoutes.use('/rooms', roomRoutes);

export default appRoutes;
