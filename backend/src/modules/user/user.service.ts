import { prisma } from '../../utils/prisma';
import { CreateUserInput } from './user.schema';
import { hashPassword } from '../../utils/hash';

export const createUser = async (input: CreateUserInput) => {
  const {password, ...rest} = input;
  const {hash, salt} = hashPassword(password);
  const user = await prisma.user.create({data: {...rest, salt, password: hash}});

  return user;
}

export const getAllUsers = async () => {
  const users = await prisma.user.findMany();

  return users;
}
