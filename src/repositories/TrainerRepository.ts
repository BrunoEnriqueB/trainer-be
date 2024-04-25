import prisma from '@src/config/client';

import { Trainer_Students, Trainers, Users } from '@prisma/client';

import { InternalServerError } from '@src/domain/HttpErrors';
import { StudentAlreadyAssignedException } from '@src/domain/StudentExceptions';
import {
  TrainerAlreadyExistsException,
  TrainerNotFoundException
} from '@src/domain/TrainerExceptions';
import { UserNotFoundException } from '@src/domain/UserExceptions';

import { TrainerUniqueKeysType } from '@src/schemas/Trainer';
import { UserUniqueKeysPartialType } from '@src/schemas/User';

export type PublicUser = {
  id: string;
  student_id: string;
  name: string;
  document: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

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

  static trainerExists(trainer_id: string): Promise<boolean> {
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

  static insertTrainer(user_id: string): Promise<Trainers> {
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
    trainer_id: string,
    student_id: string
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

  static getStudents(trainer_id: string): Promise<PublicUser[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const students = await prisma.$queryRaw<PublicUser[]>`SELECT u.id id, 
                s.student_id student_id,
                u.name name, 
                u.document document, 
                u.email email, 
                u.created_at created_at, 
                u.updated_at updated_at FROM public."trainerxstudent" ts 
        INNER JOIN public."Students" s  USING (student_id)
        INNER JOIN public."Users" u ON s.user_id = u.id
        WHERE trainer_id = ${trainer_id}`;

        resolve(students);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
}
