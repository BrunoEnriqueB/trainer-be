import prisma from '@src/config/client';

import { Trainer_Students, Trainers } from '@prisma/client';

import { InternalServerError } from '@src/domain/HttpErrors';
import {
  TrainerAlreadyExistsException,
  TrainerNotFoundException
} from '@src/domain/TrainerExceptions';

import { uuidType } from '@src/schemas/Generic';
import { UserUniqueKeysType } from '@src/schemas/User';
import { UserNotFoundException } from '@src/domain/UserExceptions';

export default class TrainerRepository {
  static getTrainerByUserAndThrow(
    userUniqueKeys: UserUniqueKeysType
  ): Promise<Trainers> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.users.findUnique({
          where: userUniqueKeys
        });

        if (!user) {
          return reject(new UserNotFoundException());
        }

        const trainer = await prisma.trainers.findUnique({
          where: { user_id: user.id }
        });

        if (!trainer) {
          return reject(new TrainerNotFoundException());
        }

        resolve(trainer);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static getTrainerByUser(
    userUniqueKeys: UserUniqueKeysType
  ): Promise<Trainers | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.users.findUnique({
          where: userUniqueKeys
        });

        if (!user) {
          return reject(new UserNotFoundException());
        }

        const trainer = await prisma.trainers.findUnique({
          where: { user_id: user.id }
        });

        resolve(trainer);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static trainerExists(id: uuidType): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const trainer = await prisma.trainers.findUnique({
          where: { id }
        });

        resolve(!!trainer);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static insertTrainer(user_id: uuidType): Promise<Trainers> {
    return new Promise(async (resolve, reject) => {
      try {
        const findTrainer = await prisma.trainers.findUnique({
          where: { user_id }
        });

        if (findTrainer) {
          return reject(new TrainerAlreadyExistsException());
        }

        const trainer = await prisma.trainers.create({ data: { user_id } });

        resolve(trainer);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static assignStudent(
    trainer_id: uuidType,
    student_id: uuidType
  ): Promise<Trainer_Students> {
    return new Promise(async (resolve, reject) => {
      try {
        const trainerXStudent = await prisma.trainer_Students.create({
          data: { trainer_id, student_id }
        });

        resolve(trainerXStudent);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
}
