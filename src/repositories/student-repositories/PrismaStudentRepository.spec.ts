import { Students } from '@prisma/client';
import { randomUUID } from 'node:crypto';

import { prisma as prismaMock } from '@src/libs/__mocks__/prisma';
import { describe, expect, it } from 'vitest';

import PrismaStudentRepository from './PrismaStudentRepository';

describe('Student Repository find method', () => {
  const prismaStudentRepository = new PrismaStudentRepository();

  it('should find a student', async () => {
    const student: Students = {
      student_id: randomUUID(),
      user_id: randomUUID()
    };

    prismaMock.students.findUnique.mockResolvedValue(student);

    expect(
      prismaStudentRepository.find(student.student_id)
    ).resolves.toStrictEqual(student);
  });

  it('should not find a student', async () => {
    prismaMock.students.findUnique.mockResolvedValue(null);

    expect(prismaStudentRepository.find('1')).resolves.toStrictEqual(null);
  });
});

describe('Student Repository create method', () => {
  const prismaStudentRepository = new PrismaStudentRepository();

  it('should find a student', async () => {
    const student: Students = {
      student_id: randomUUID(),
      user_id: randomUUID()
    };

    prismaMock.students.create.mockResolvedValue(student);

    expect(
      prismaStudentRepository.create(student.user_id)
    ).resolves.toStrictEqual(student);
  });
});
