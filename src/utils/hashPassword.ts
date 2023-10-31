import bcrypt from 'bcrypt';

const SALT = 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
