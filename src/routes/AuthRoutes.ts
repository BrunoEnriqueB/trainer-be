import express from 'express';

import AuthController from '@src/controllers/AuthController';

const router = express.Router();

router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);

export default router;
