import { Router } from 'express';
import { authController } from '../controllers';
import {authenticateToken} from "../middleware";

const authRoutes: Router = Router();

authRoutes.post('/sign-up', authController.signUp);
authRoutes.post('/sign-in', authController.signIn);
authRoutes.post('/forgot-password', authController.forgotPassword);
authRoutes.post('/reset-password', authenticateToken, authController.resetPassword);

export default authRoutes;

