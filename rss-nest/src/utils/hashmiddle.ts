import * as bcrypt from 'bcryptjs';

const createHash = async (
  password: string | undefined
): Promise<string | undefined> => {
  const saltRounds: number = 11;
  const salt = await bcrypt.genSalt(saltRounds);
  if (password !== undefined) {
    const hash: string = await bcrypt.hash(password, salt);
    return hash;
  }
  return undefined;
};

const chechHash = async (
  password: string,
  hash: string | undefined
): Promise<boolean> => {
  if (hash !== undefined) {
    return await bcrypt.compare(password, hash);
  }
  return false;
};

export { createHash, chechHash };
