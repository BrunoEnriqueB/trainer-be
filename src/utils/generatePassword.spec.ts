import { describe, expect, it } from 'vitest';
import generatePassword from './generatePassword';

describe('generatePassword util test', () => {
  it('should return a strong password', () => {
    const password = generatePassword();

    expect(password).toHaveLength(15);
    expect(/\W+/.test(password)).toBeTruthy();
    expect(/\d+/.test(password)).toBeTruthy();
    expect(/\w+/.test(password)).toBeTruthy();
  });
});
