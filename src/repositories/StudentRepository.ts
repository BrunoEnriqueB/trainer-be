import prisma from '@src/libs/client';

import { Students } from '@prisma/client';

import { InternalServerError } from '@src/domain/HttpErrors';
import { UserNotFoundException } from '@src/domain/UserExceptions';
import {
  StudentAlreadyExistsException,
  StudentNotFoundException
} from '@src/domain/StudentExceptions';

import { uuidType } from '@src/schemas/Generic';
import { UserUniqueKeysPartialType } from '@src/schemas/User';

export default class StudentRepository {
  static getStudentByUserAndThrow(
    userUniqueKeys: UserUniqueKeysPartialType
  ): Promise<Students> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.users.findUnique({
          where: userUniqueKeys
        });

        if (!user) {
          return reject(new UserNotFoundException());
        }

        const student = await prisma.students.findUnique({
          where: { user_id: user.id }
        });

        if (!student) {
          return reject(new StudentNotFoundException());
        }

        resolve(student);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
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
