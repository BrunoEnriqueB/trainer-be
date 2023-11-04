import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { HttpError } from '@src/domain/HttpErrors';

import { userUniqueKeysPartial } from '@src/schemas/User';
import StudentService from '@src/services/StudentService';

export default class StudentController {
  static async createStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentData = userUniqueKeysPartial.parse(req.body);
      await StudentService.insertStudent(studentData);

      res.status(201).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }
}
