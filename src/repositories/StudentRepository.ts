import prisma from '@src/config/client';

import { Students } from '@prisma/client';

import { InternalServerError } from '@src/domain/HttpErrors';
import {
  StudentAlreadyExistsException,
  StudentNotFoundException
} from '@src/domain/StudentExceptions';

import { uuidType } from '@src/schemas/Generic';

export default class StudentRepository {
  static insertStudent(user_id: uuidType): Promise<Students> {
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
