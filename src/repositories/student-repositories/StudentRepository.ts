import { Students } from '@prisma/client';
import { RequireAtLeastOne } from '@src/@types';

export interface IStudentRepository {
  find(student_id: string): Promise<Students | null>;
  create(user_id: string): Promise<Students>;
}
