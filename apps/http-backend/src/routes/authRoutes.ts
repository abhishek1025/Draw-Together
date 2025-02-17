import { Router } from 'express';
import { authController } from '../controllers';

const authRoutes: Router = Router();

authRoutes.post('/sign-up', authController.signUp);
authRoutes.post('/sign-in', authController.signIn);

export default authRoutes;

