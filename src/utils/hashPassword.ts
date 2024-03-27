import bcrypt from 'bcrypt';

const SALT = 10;

export async function hashPassword(password: string): Promise<string> {
  password = await bcrypt.hash(password, SALT);
  return password;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
