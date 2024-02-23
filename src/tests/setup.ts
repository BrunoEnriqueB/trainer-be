import { beforeEach, vi } from 'vitest';
import { prisma as prismaMock } from '@src/libs/__mocks__/prisma';

beforeEach(() => {
  vi.mock('@src/libs/client', async () => {
    return {
      prisma: prismaMock
    };
  });
});
