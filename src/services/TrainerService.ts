import UserRepository from '@src/repositories/UsersRepository';
import TrainerRepository from '@src/repositories/TrainerRepository';

import { UserUniqueKeysType } from '@src/schemas/User';

export default class TrainerService {
  static async insertTrainer(trainer: UserUniqueKeysType): Promise<void> {
    try {
      const findUser = await UserRepository.getUserAndThrow(trainer);

      await TrainerRepository.insertTrainer(findUser.id);
    } catch (error) {
      throw error;
    }
  }
}
