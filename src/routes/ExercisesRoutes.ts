import express from 'express';

import ExerciseController from '@src/controllers/ExercisesController';
import upload from '@src/config/multer';
import validateTrainer from '@src/middlewares/validateTrainer';

const router = express.Router();

router.post(
  '/create',
  validateTrainer,
  upload.single('video'),
  ExerciseController.create
);

export default router;
