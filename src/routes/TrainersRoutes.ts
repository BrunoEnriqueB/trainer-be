import express from 'express';

import TrainerController from '@src/controllers/TrainerControllers';

import validateTrainer from '@src/middlewares/validateTrainer';
import validateUser from '@src/middlewares/validateToken';

const router = express.Router();

router.get('', validateTrainer, TrainerController.findTrainer);
router.get('/:id', validateTrainer, TrainerController.findTrainerById);
router.get(
  '/:trainerId/students',
  validateUser,
  TrainerController.getTrainerStudents
);
router.post('/create', validateUser, TrainerController.createTrainer);
router.post('/assign', validateTrainer, TrainerController.assignStudent);

export default router;
