import express from 'express';

import StudentController from '@src/controllers/StudentController';
import validateTrainer from '@src/middlewares/validateTrainer';

const router = express.Router();

router.post('/create', validateTrainer, StudentController.createStudent);

export default router;
