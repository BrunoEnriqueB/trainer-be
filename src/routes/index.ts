import { Router } from 'express';

import AuthRoutes from '@routes/AuthRoutes';
import ExercisesRoutes from '@routes/ExercisesRoutes';
import StudentRoutes from '@routes/StudentsRoutes';
import TrainerRoutes from '@routes/TrainersRoutes';
import UserRoutes from '@routes/UsersRoutes';
import WorkoutsRoutes from '@routes/WorkoutsRoutes';

import validateUser from '@src/middlewares/validateToken';
import validateTrainer from '@src/middlewares/validateTrainer';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/student', StudentRoutes);
router.use('/trainers', validateUser, TrainerRoutes);
router.use('/users', validateUser, UserRoutes);
router.use('/exercises', validateTrainer, ExercisesRoutes);
router.use('/workouts', validateUser, WorkoutsRoutes);

export default router;
