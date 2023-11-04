import UserRepository from '@src/repositories/UsersRepository';
import TrainerRepository from '@src/repositories/TrainerRepository';

import { UserUniqueKeysPartialType } from '@src/schemas/User';
import { Trainers } from '@prisma/client';
import { TrainerNotFoundException } from '@src/domain/TrainerExceptions';
import StudentRepository from '@src/repositories/StudentRepository';

export default class TrainerService {
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
  ) {
    try {
      const trainerExists = await TrainerRepository.trainerExists(trainer.id);

      if (!trainerExists) {
        throw new TrainerNotFoundException();
      }

      const findStudent = await StudentRepository.getStudentByUserAndThrow(
        student
      );

      await TrainerRepository.assignStudent(trainer.id, findStudent.id);
    } catch (error) {
      throw error;
    }
  }
}
