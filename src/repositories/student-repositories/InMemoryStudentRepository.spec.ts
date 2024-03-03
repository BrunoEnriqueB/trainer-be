import { Students } from '@prisma/client';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import InMemoryStudentRepository from './InMemoryStudentRepository';

describe('Student Repository find method', () => {
  let inMemoryStudentRepository: InMemoryStudentRepository;

  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
  });

  it('should find a student', () => {
    const student: Students = {
      student_id: '1',
      user_id: '1'
    };

    inMemoryStudentRepository.students.push(student);

    expect(
      inMemoryStudentRepository.find(student.student_id)
    ).resolves.toStrictEqual(student);
  });

  it('should not find a student', () => {
    const student: Students = {
      student_id: '1',
      user_id: '1'
    };

    inMemoryStudentRepository.students.push(student);

    expect(inMemoryStudentRepository.find('1')).resolves.toStrictEqual(student);
  });
});

describe('Student Repository create method', () => {
  let inMemoryStudentRepository: InMemoryStudentRepository;

  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    vi.mock('node:crypto', async (importOriginal) => {
      return {
        ...(await importOriginal<typeof import('node:crypto')>()),
        randomUUID: () => '1234'
      };
    });
  });

  it('should find a student', async () => {
    const student: Students = {
      student_id: '1234',
      user_id: '1'
    };

    expect(
      inMemoryStudentRepository.create(student.user_id)
    ).resolves.toStrictEqual(student);
    expect(inMemoryStudentRepository.students).toHaveLength(1);
    expect(inMemoryStudentRepository.students[0]).toStrictEqual(student);
  });
});
