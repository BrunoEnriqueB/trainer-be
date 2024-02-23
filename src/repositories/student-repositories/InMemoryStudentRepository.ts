import { Students } from '@prisma/client';
import { randomUUID } from 'node:crypto';

import { IStudentRepository } from './StudentRepository';

export default class InMemoryStudentRepository implements IStudentRepository {
  public students: Students[] = [];
  async find(student_id: string): Promise<Students | null> {
    return this.students.find((s) => s.student_id === student_id) || null;
  }

  async create(user_id: string): Promise<Students> {
    const student: Students = {
      student_id: randomUUID(),
      user_id
    };

    this.students.push(student);

    return student;
  }
}
