import { FastifyReply, FastifyRequest } from 'fastify';

import { server } from '../../app';
import { verifyPassword } from '../../utils/hash';
import { TCreateUserInput, TLoginInput } from './user.schema';
import { createUser, findUserByEmail, findUsers } from './user.service';


export const registerUserHandler = async (request: FastifyRequest<{
  Body: TCreateUserInput
}>, reply: FastifyReply) => {
  const body = request.body;

  try {
    const user = await createUser(body);

    return reply.code(201).send(user);
  } catch (err) {
    console.error(err);

    return reply.code(500).send(err);
  }
};

export const getAllUsersHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await findUsers();

    return reply.code(200).send(users);
  } catch (err) {
    console.error(err);

    return reply.code(500).send(err);
  }
};

export const loginHandler = async (request: FastifyRequest<{
  Body: TLoginInput
}>, reply: FastifyReply) => {
  const body = request.body;

  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({ message: 'Invalid email or password' });
  }

  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password
  });

  if (correctPassword) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...rest } = user;

    return { accessToken: server.jwt.sign(rest) };
  }

  return reply.code(401).send({ message: 'Invalid email or password' });
};
