import express from 'express';

import TrainerController from '@src/controllers/TrainerControllers';

import validateTrainer from '@src/middlewares/validateTrainer';

const router = express.Router();

router.post('/create', TrainerController.createTrainer);
router.post('/assign', validateTrainer, TrainerController.assignStudent);

export default router;
