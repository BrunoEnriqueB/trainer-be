import {
  Prisma,
  Students,
  Trainer_Students,
  Trainers,
  Users
} from '@prisma/client';
import { InternalServerError } from '@src/domain/HttpErrors';
import {
  StudentAlreadyAssignedException,
  StudentNotFoundException
} from '@src/domain/StudentExceptions';
import { prisma } from '@src/libs/client';
import ITrainerRepository, { UsersWithStudent } from './TrainerRepository';
import {
  TrainerAlreadyExistsException,
  TrainerNotFoundException
} from '@src/domain/TrainerExceptions';
import { UserNotFoundException } from '@src/domain/UserExceptions';

export type StudentWithUserData = Students & {
  userId: Users;
};

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
        const exists = !!(await prisma.trainers.count({
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
        const [findUser, findTrainer] = await prisma.$transaction([
          prisma.users.findUnique({
            where: {
              id: user_id
            }
          }),
          prisma.trainers.findUnique({
            where: { user_id }
          })
        ]);

        if (!findUser) {
          return reject(new UserNotFoundException());
        }

        if (findTrainer) {
          return reject(new TrainerAlreadyExistsException());
        }

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
        const [findTrainer, findStudent, countTrainerXStudent] =
          await prisma.$transaction([
            prisma.trainers.findUnique({
              where: {
                trainer_id
              }
            }),
            prisma.students.findUnique({
              where: {
                student_id
              }
            }),
            prisma.trainer_Students.count({
              where: {
                trainer_id,
                student_id
              }
            })
          ]);

        if (!findTrainer) {
          return reject(new TrainerNotFoundException());
        }

        if (!findStudent) {
          return reject(new StudentNotFoundException());
        }

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
        const findTrainer = await prisma.trainers.findUnique({
          where: {
            trainer_id
          }
        });

        if (!findTrainer) {
          return reject(new TrainerNotFoundException());
        }

        const users: StudentWithUserData[] = await prisma.students.findMany({
          where: {
            Trainer_Students: {
              every: {
                trainer_id
              }
            }
          },
          include: {
            userId: true
          }
        });

        const parsedUsers: UsersWithStudent[] = users.map((student) => {
          return {
            id: student.userId.id,
            document: student.userId.document,
            name: student.userId.name,
            email: student.userId.email,
            password: student.userId.password,
            created_at: student.userId.created_at,
            updated_at: student.userId.updated_at,
            student_id: student.student_id
          };
        });

        return resolve(parsedUsers);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
}
