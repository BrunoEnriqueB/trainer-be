import UserRepository from '@src/repositories/UsersRepository';
import StudentRepository from '@src/repositories/StudentRepository';

import { UserUniqueKeysPartialType } from '@src/schemas/User';

export default class StudentService {
  static async insertStudent(
    trainer: UserUniqueKeysPartialType
  ): Promise<void> {
    try {
      const findUser = await UserRepository.getUserAndThrow(trainer);

      await StudentRepository.insertStudent(findUser.id);
    } catch (error) {
      throw error;
    }
  }
}
