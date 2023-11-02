import { UserUniqueKeysType } from '@src/schemas/User';

import UserRepository from '@src/repositories/UsersRepository';
import TrainerRepository from '@src/repositories/TrainerRepository';

export default class TrainerService {
  static async insertTrainer(trainer: UserUniqueKeysType): Promise<void> {
    try {
      const findUser = await UserRepository.getUser(trainer);

      await TrainerRepository.insertTrainer(findUser.id);
    } catch (error) {
      throw error;
    }
  }
}
