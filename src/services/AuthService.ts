import Token from '@src/libs/token';

import { Trainers, Users } from '@prisma/client';

import { ITrainerRepository } from '@src/repositories/trainer-repositories/TrainerRepository';
import { IUserRepository } from '@src/repositories/user-repositories/UserRepository';

import { UserSignType, UserUniqueKeysPartialType } from '@src/schemas/User';

import {
  InvalidCredentials,
  TokenNotAuthorized,
  UserMustBeATrainer
} from '@src/domain/AuthExceptions';
import { RecoveryPasswordTemplate } from '@src/domain/EmailConstructor';
import { UserNotFoundException } from '@src/domain/UserExceptions';

import { uuidType } from '@src/schemas/Generic';

import generatePassword from '@src/utils/generatePassword';
import { hashPassword, verifyPassword } from '@src/utils/hashPassword';
import sendEmail from '@src/utils/sendEmail';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async authUser(user: UserSignType): Promise<string> {
    try {
      const { password, ...keys } = user;

      const findUser = await this.userRepository.find(keys);

      if (!findUser) {
        throw new UserNotFoundException();
      }

      const isPasswordValid = await verifyPassword(password, findUser.password);

      if (!isPasswordValid) {
        throw new InvalidCredentials();
      }

      const token = await Token.createToken(findUser.id);

      return token;
    } catch (error) {
      throw error;
    }
  }

  async validateUser(userId: uuidType): Promise<Users> {
    try {
      const user = await this.userRepository.find({
        id: userId
      });

      if (!user) {
        throw new TokenNotAuthorized();
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async validateTrainer(userId: uuidType): Promise<Trainers> {
    try {
      const user = await this.userRepository.find({
        id: userId
      });

      if (!user) {
        throw new TokenNotAuthorized();
      }

      if (!user.Trainers) {
        throw new UserMustBeATrainer();
      }

      return user.Trainers;
    } catch (error) {
      throw error;
    }
  }

  async recoveryUserPassword(user: UserUniqueKeysPartialType) {
    try {
      const findUser = await this.userRepository.find(user);

      if (!findUser) {
        throw new UserNotFoundException();
      }

      const generatedPassword = generatePassword();

      const newUserPassword = await hashPassword(generatedPassword);

      await this.userRepository.updatePassword(findUser.id, newUserPassword);

      await sendEmail(
        new RecoveryPasswordTemplate([findUser.email], generatedPassword)
      );
    } catch (error) {
      throw error;
    }
  }
}
