import { Router } from 'express';

import UserController from '@src/controllers/UserController';
import { UserService } from '@src/services/UserService';
import PrismaUserRepository from '@src/repositories/user-repositories/PrismaUserRepository';

const router = Router();

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/:id', userController.findUserById);
router.get('/email/:email', userController.findUser);
router.patch('/:email', userController.updateUser);
router.post('/:email/change-password', userController.changePassword);

export default router;
