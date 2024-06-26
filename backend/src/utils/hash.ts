import * as crypto from 'node:crypto';

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');

  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  return { hash, salt };
};

interface IVerifyPassword {
  candidatePassword: string;
  salt: string;
  hash: string;
}

export const verifyPassword = ({ candidatePassword, salt, hash }: IVerifyPassword) => {
  const candidateHash = crypto.pbkdf2Sync(candidatePassword, salt, 1000, 64, 'sha512').toString('hex');

  return candidateHash === hash;
};
