import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import { hashPassword, verifyPassword } from './hashPassword';

beforeEach(() => {
  vi.mock('bcrypt', () => {
    return {
      default: {
        hash: vi.fn((data: string, salt: number) => `${data}${salt}`),
        compare: vi.fn((data: string, test: string) => true)
      }
    };
  });
});

describe('hashPassword util test', () => {
  it('should return a hashed password', () => {
    const password = 'myPassword';
    const salt = 10;

    expect(hashPassword(password)).resolves.toEqual(`${password}${salt}`);
  });
});

describe('verifyPassword util test', () => {
  it('should return passwords matches', () => {
    expect(verifyPassword('a', 'a')).resolves.toBeTruthy();
  });

  it('should return passwords does not matches', () => {
    expect(verifyPassword('a', 'b')).resolves.toBeTruthy();
  });
});
