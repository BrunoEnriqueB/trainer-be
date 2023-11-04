import Token from '@src/libs/token';

import { Trainers, Users } from '@prisma/client';

import UserRepository from '@src/repositories/UsersRepository';
import TrainerRepository from '@src/repositories/TrainerRepository';

import { UserSignType, UserUniqueKeysType } from '@src/schemas/User';

import { hashPassword, verifyPassword } from '@src/utils/hashPassword';

import { UserNotFoundException } from '@src/domain/UserExceptions';
import { UserMustBeATrainer } from '@src/domain/AuthExceptions';
import { uuidType } from '@src/schemas/Generic';
import generatePassword from '@src/utils/generatePassword';
import sendEmail from '@src/utils/sendEmail';
import { RecoveryPasswordTemplate } from '@src/domain/EmailConstructor';

export default class AuthService {
  static async authUser(user: UserSignType): Promise<string> {
    try {
      const { password, ...keys } = user;

      const userFind = await UserRepository.getUserAndThrow(keys);

      const isPasswordValid = await verifyPassword(password, userFind.password);

      if (!isPasswordValid) {
        throw new UserNotFoundException();
      }

      const token = await Token.createToken(userFind.id);

      return token;
    } catch (error) {
      throw error;
    }
  }

  static async validateUser(userId: uuidType): Promise<Users> {
    try {
      const user = await UserRepository.getUserAndThrow({ id: userId });

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async validateTrainer(userId: uuidType): Promise<Trainers> {
    try {
      const user = await UserRepository.getUserAndThrow({ id: userId });

      const trainerFind = await TrainerRepository.getTrainerByUser(user);

      if (!trainerFind) {
        throw new UserMustBeATrainer();
      }

      return trainerFind;
    } catch (error) {
      throw error;
    }
  }

  static async recoveryUserPassword(user: UserUniqueKeysType) {
    try {
      const findUser = await UserRepository.getUserAndThrow(user);

      const generatedPassword = generatePassword();

      const newUserPassword = await hashPassword(generatedPassword);

      await UserRepository.changePassword(findUser.id, newUserPassword);

      await sendEmail(
        new RecoveryPasswordTemplate([findUser.email], generatedPassword)
      );
    } catch (error) {
      throw error;
    }
  }
}
