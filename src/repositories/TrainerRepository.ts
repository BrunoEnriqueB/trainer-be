import prisma from '@src/config/client';

import { Trainer_Students, Trainers, Users } from '@prisma/client';

import { StudentAlreadyAssignedException } from '@src/domain/StudentExceptions';
import { InternalServerError } from '@src/domain/HttpErrors';
import {
  TrainerAlreadyExistsException,
  TrainerNotFoundException
} from '@src/domain/TrainerExceptions';

import { uuidType } from '@src/schemas/Generic';
import { UserUniqueKeysPartialType } from '@src/schemas/User';
import { UserNotFoundException } from '@src/domain/UserExceptions';
import { TrainerUniqueKeysType } from '@src/schemas/Trainer';

export default class TrainerRepository {
  static getTrainerByUserOrThrow(
    userUniqueKeys: TrainerUniqueKeysType
  ): Promise<Users & Trainers> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.users.findUnique({
          where: userUniqueKeys,
          include: {
            Trainers: true
          }
        });

        if (!user) {
          return reject(new UserNotFoundException());
        }

        if (!user.Trainers) {
          return reject(new TrainerNotFoundException());
        }

        let { Trainers, ...restUser } = user;

        resolve({ ...restUser, ...Trainers });
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static getTrainerByUser(
    userUniqueKeys: UserUniqueKeysPartialType
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

  static trainerExists(trainer_id: uuidType): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const trainer = await prisma.trainers.findUnique({
          where: { trainer_id }
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
        const countTrainerXStudent = await prisma.trainer_Students.count({
          where: { trainer_id, student_id }
        });

        if (countTrainerXStudent) {
          reject(new StudentAlreadyAssignedException());
        }

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
