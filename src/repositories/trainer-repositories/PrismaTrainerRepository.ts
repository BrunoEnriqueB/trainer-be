import { Trainer_Students, Trainers } from '@prisma/client';
import ITrainerRepository, { UsersWithStudent } from './TrainerRepository';
import { prisma } from '@src/libs/client';
import { StudentAlreadyAssignedException } from '@src/domain/StudentExceptions';
import test from 'node:test';
import { user } from '@src/schemas/User';

export default class PrismaTrainerRepository implements ITrainerRepository {
  find(trainer_id: string): Promise<Trainers | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const trainers = await prisma.trainers.findUnique({
          where: {
            trainer_id
          }
        });

        return resolve(trainers);
      } catch (error) {
        return reject(error);
      }
    });
  }

  exists(trainer_id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const exists = !!(await prisma.trainers.findMany({
          where: {
            trainer_id
          }
        }));

        return resolve(exists);
      } catch (error) {
        return reject(error);
      }
    });
  }

  create(user_id: string): Promise<Trainers> {
    return new Promise(async (resolve, reject) => {
      try {
        const trainer = await prisma.trainers.create({
          data: {
            user_id
          }
        });

        return resolve(trainer);
      } catch (error) {
        return reject(error);
      }
    });
  }

  assignStudent(
    trainer_id: string,
    student_id: string
  ): Promise<Trainer_Students> {
    return new Promise(async (resolve, reject) => {
      try {
        const countTrainerXStudent = await prisma.trainer_Students.count({
          where: {
            trainer_id,
            student_id
          }
        });

        if (countTrainerXStudent) {
          return reject(new StudentAlreadyAssignedException());
        }

        const trainerStudent = await prisma.trainer_Students.create({
          data: {
            trainer_id,
            student_id
          }
        });

        return resolve(trainerStudent);
      } catch (error) {
        return reject(error);
      }
    });
  }

  getStudents(trainer_id: string): Promise<UsersWithStudent[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await prisma.users.findMany({
          include: {
            Students: {
              where: {
                Trainer_Students: {
                  every: {
                    trainer_id
                  }
                }
              }
            }
          }
        });

        const parsedUsers = users.map((user) => {
          const { Students, password, ...userWithoutStudent } = user;

          return {
            ...userWithoutStudent,
            student_id: Students!.student_id
          };
        });

        return resolve(parsedUsers);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
}
