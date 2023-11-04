import express from 'express';

import AuthController from '@src/controllers/AuthController';

const router = express.Router();

router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.post('/recovery-password', AuthController.recoveryPassword);

export default router;
