import { Trainers } from '@prisma/client';

import UserRepository from '@src/repositories/UsersRepository';
import TrainerRepository from '@src/repositories/TrainerRepository';
import StudentRepository from '@src/repositories/StudentRepository';

import { UserUniqueKeysType } from '@src/schemas/User';

export default class StudentService {
  static async insertStudent(trainer: UserUniqueKeysType): Promise<void> {
    try {
      const findUser = await UserRepository.getUserAndThrow(trainer);

      await StudentRepository.insertStudent(findUser.id);
    } catch (error) {
      throw error;
    }
  }
}
