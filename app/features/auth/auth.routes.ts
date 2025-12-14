import { Router } from 'express';
import authController from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  updateProfileValidation,
  changePasswordValidation,
} from './auth.validation';

const router = Router();

// Public routes
router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.post('/refresh-token', validate(refreshTokenValidation), authController.refreshToken);

// Protected routes
router.use(authenticate);
router.post('/logout', validate(refreshTokenValidation), authController.logout);
router.get('/profile', authController.getProfile);
router.put('/profile', validate(updateProfileValidation), authController.updateProfile);
router.put('/change-password', validate(changePasswordValidation), authController.changePassword);

export default router;
