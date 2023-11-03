import express from 'express';

import TrainerController from '@src/controllers/TrainerControllers';

import validateUser from '@src/middlewares/validateToken';
import validateTrainer from '@src/middlewares/validateTrainer';

const router = express.Router();

router.post('/create', validateUser, TrainerController.createTrainer);
router.post('/assign', validateTrainer, TrainerController.assignStudent);

export default router;
