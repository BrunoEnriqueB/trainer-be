import { Router } from 'express';

import StudentRoutes from './StudentsRoutes';
import TrainerRoutes from './TrainersRoutes';
import UserRoutes from './UsersRoutes';

const router = Router();

router.use('/student', StudentRoutes);
router.use('/trainer', TrainerRoutes);
router.use('/user', UserRoutes);

export default router;
