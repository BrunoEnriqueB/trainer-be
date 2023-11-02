import TrainerController from '@src/controllers/TrainerControllers';
import validateUser from '@src/middlewares/validateToken';
import express from 'express';

const router = express.Router();

router.post('/create', validateUser, TrainerController.createTrainer);

export default router;
