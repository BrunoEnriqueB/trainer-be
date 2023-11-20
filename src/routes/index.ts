import { Router } from 'express';

import AuthRoutes from '@routes/AuthRoutes';
import StudentRoutes from '@routes/StudentsRoutes';
import TrainerRoutes from '@routes/TrainersRoutes';
import UserRoutes from '@routes/UsersRoutes';
import ExercisesRoutes from '@routes/ExercisesRoutes';

import validateUser from '@src/middlewares/validateToken';
import validateTrainer from '@src/middlewares/validateTrainer';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/student', StudentRoutes);
router.use('/trainers', validateUser, TrainerRoutes);
router.use('/users', validateUser, UserRoutes);
router.use('/exercises', validateTrainer, ExercisesRoutes);

export default router;
