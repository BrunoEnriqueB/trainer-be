import { Router } from 'express';

import AuthRoutes from '@routes/AuthRoutes';
import StudentRoutes from '@routes/StudentsRoutes';
import TrainerRoutes from '@routes/TrainersRoutes';
import UserRoutes from '@routes/UsersRoutes';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/student', StudentRoutes);
router.use('/trainer', TrainerRoutes);
router.use('/user', UserRoutes);

export default router;
