import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser, getAllUsers } from './user.service';
import { CreateUserInput } from './user.schema';

export const registerUserHandler = async (request: FastifyRequest<{
  Body: CreateUserInput
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
    const users = await getAllUsers();

    return reply.code(200).send(users);
  } catch (err) {
    console.error(err);

    return reply.code(500).send(err);
  }
}
