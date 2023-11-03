import { Router } from 'express';

import validateUser from '@src/middlewares/validateToken';

import UserController from '@src/controllers/UserController';

const router = Router();

router.patch('/', validateUser, UserController.updateUser);

export default router;
