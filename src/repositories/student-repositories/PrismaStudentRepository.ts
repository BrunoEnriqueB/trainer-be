import { Students } from '@prisma/client';
import { InternalServerError } from '@src/domain/HttpErrors';
import { StudentAlreadyExistsException } from '@src/domain/StudentExceptions';
import { prisma } from '@src/libs/client';
import { IStudentRepository } from './StudentRepository';

export default class PrismaStudentRepository implements IStudentRepository {
  async find(student_id: string): Promise<Students | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const students = await prisma.students.findUnique({
          where: { student_id }
        });

        resolve(students);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  async create(user_id: string): Promise<Students> {
    return new Promise(async (resolve, reject) => {
      try {
        const findStudent = await prisma.students.findUnique({
          where: { user_id }
        });

        if (findStudent) {
          return reject(new StudentAlreadyExistsException());
        }

        const student = await prisma.students.create({ data: { user_id } });

        resolve(student);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
}
