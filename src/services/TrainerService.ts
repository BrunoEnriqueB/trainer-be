import UserRepository from '@src/repositories/UsersRepository';
import TrainerRepository from '@src/repositories/TrainerRepository';
import StudentRepository from '@src/repositories/StudentRepository';

import { Trainers } from '@prisma/client';

import { TrainerNotFoundException } from '@src/domain/TrainerExceptions';

import { uuidType } from '@src/schemas/Generic';
import { TrainerUniqueKeysType } from '@src/schemas/Trainer';
import { UserUniqueKeysPartialType } from '@src/schemas/User';

import { publicUser } from '@src/@types/user';

export default class TrainerService {
  static async getTrainer(
    trainer: TrainerUniqueKeysType
  ): Promise<publicUser & Trainers> {
    try {
      const { password, ...trainerData } =
        await TrainerRepository.getTrainerByUserOrThrow(trainer);

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

      await TrainerRepository.assignStudent(
        trainer.trainer_id,
        findStudent.student_id
      );
    } catch (error) {
      throw error;
    }
  }

  static async getStudents(trainer_id: uuidType): Promise<publicUser[]> {
    try {
      const students = await TrainerRepository.getStudents(trainer_id);

      return students;
    } catch (error) {
      throw error;
    }
  }
}
