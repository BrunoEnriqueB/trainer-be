import { Router } from 'express';

import upload from '@src/config/multer';
import WorkoutsController from '@src/controllers/WorkoutsController';
import validateTrainer from '@src/middlewares/validateTrainer';

const router = Router();

router.post(
  '/create',
  validateTrainer,
  upload.single('logo'),
  WorkoutsController.create
);
router.get('/list', WorkoutsController.list);
router.get('/:id', WorkoutsController.findById);
router.put(
  '/update/students',
  validateTrainer,
  WorkoutsController.updateStudents
);
router.put(
  '/update/exercises',
  validateTrainer,
  WorkoutsController.updateExercises
);

export default router;
