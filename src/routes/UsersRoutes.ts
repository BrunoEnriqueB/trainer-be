import { Router } from 'express';

import validateUser from '@src/middlewares/validateToken';

import UserController from '@src/controllers/UserController';

const router = Router();

router.get('/:id', validateUser, UserController.findUserById);
router.patch('/', validateUser, UserController.updateUser);
router.post(
  '/:email/change-password',
  validateUser,
  UserController.changePassword
);

export default router;
