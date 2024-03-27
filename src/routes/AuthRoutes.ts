import express from 'express';

import AuthController from '@src/controllers/AuthController';
import { AuthService } from '@src/services/AuthService';
import { UserService } from '@src/services/UserService';
import PrismaUserRepository from '@src/repositories/user-repositories/PrismaUserRepository';

const router = express.Router();

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService, userService);

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.post('/recovery-password', authController.recoveryPassword);

export default router;
