import bcrypt from 'bcryptjs';

function getPasswordPepper(): string {
  const pepper = process.env.PASSWORD_PEPPER;
  if (!pepper) {
    throw new Error('Missing PASSWORD_PEPPER');
  }
  return pepper;
}

export async function hashPassword(password: string): Promise<string> {
  const pepper = getPasswordPepper();
  return bcrypt.hash(`${password}${pepper}`, 12);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  const pepper = getPasswordPepper();
  return bcrypt.compare(`${password}${pepper}`, passwordHash);
}
