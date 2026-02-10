import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash de senha usando bcrypt
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compara senha com hash
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
