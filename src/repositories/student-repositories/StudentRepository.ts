import { Students } from '@prisma/client';

export interface IStudentRepository {
  find(student_id: string): Promise<Students | null>;
  create(user_id: string): Promise<Students>;
}
