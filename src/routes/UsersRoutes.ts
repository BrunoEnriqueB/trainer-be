import { Router } from 'express';

import UserController from '@src/controllers/UserController';

const router = Router();

router.get('/:id', UserController.findUserById);
router.get('/email/:email', UserController.findUser);
router.patch('/:email', UserController.updateUser);
router.post('/:email/change-password', UserController.changePassword);

export default router;
