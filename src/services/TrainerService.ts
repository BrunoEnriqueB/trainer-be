import StudentRepository from '@src/repositories/StudentRepository';
import TrainerRepository, {
  PublicStudent,
  PublicTrainer
} from '@src/repositories/TrainerRepository';
import UserRepository from '@src/repositories/UsersRepository';

import { Trainers } from '@prisma/client';

import {
  TrainerCantAssignHimselfException,
  TrainerNotFoundException
} from '@src/domain/TrainerExceptions';

import { uuidType } from '@src/schemas/Generic';
import { TrainerUniqueKeysType } from '@src/schemas/Trainer';
import { UserUniqueKeysPartialType } from '@src/schemas/User';

export default class TrainerService {
  static async getTrainer(
    trainer: TrainerUniqueKeysType
  ): Promise<PublicTrainer> {
    try {
      const trainerData = await TrainerRepository.getTrainerByUserOrThrow(
        trainer
      );

      return trainerData;
    } catch (error) {
      throw error;
    }
  }

  static async insertTrainer(
    trainer: UserUniqueKeysPartialType
  ): Promise<void> {
    try {
      const findUser = await UserRepository.getUserAndThrow(trainer);

      await TrainerRepository.insertTrainer(findUser.id);
    } catch (error) {
      throw error;
    }
  }

  static async assignStudent(
    trainer: Trainers,
    student: UserUniqueKeysPartialType
  ): Promise<void> {
    try {
      const trainerExists = await TrainerRepository.trainerExists(
        trainer.trainer_id
      );

      if (!trainerExists) {
        throw new TrainerNotFoundException();
      }

      const findStudent = await StudentRepository.getStudentByUserAndThrow(
        student
      );

      if (findStudent.user_id === trainer.user_id) {
        throw new TrainerCantAssignHimselfException();
      }

      await TrainerRepository.assignStudent(
        trainer.trainer_id,
        findStudent.student_id
      );
    } catch (error) {
      throw error;
    }
  }

  static async getStudents(trainer_id: uuidType): Promise<PublicStudent[]> {
    try {
      const students = await TrainerRepository.getStudents(trainer_id);

      return students;
    } catch (error) {
      throw error;
    }
  }
}
