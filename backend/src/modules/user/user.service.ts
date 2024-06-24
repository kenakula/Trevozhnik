import { hashPassword } from '../../utils/hash';
import { prisma } from '../../utils/prisma';
import { TCreateUserInput } from './user.schema';

export const createUser = async (input: TCreateUserInput) => {
  const { password, ...rest } = input;
  const { hash, salt } = hashPassword(password);
  const user = await prisma.user.create({ data: { ...rest, salt, password: hash } });

  return user;
};

export const findUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    }
  });

  return users;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};
