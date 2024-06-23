import { FastifyInstance } from 'fastify';
import { getAllUsersHandler, registerUserHandler } from './user.controller';
import { $ref } from './user.schema';

export const userRoutes = async (server: FastifyInstance) => {
  server.post('/', {
    schema: {
      body: $ref('createUserScheme'),
      response: {
        201: $ref('createUserResponseSchema')
      }
    }
  }, registerUserHandler);

  server.get('/', {
    schema: {
      response: {
        200: $ref('getAllUsersResponseSchema')
      }
    }
  }, getAllUsersHandler);
};
