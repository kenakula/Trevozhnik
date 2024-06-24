import { FastifyInstance } from 'fastify';

import { getAllUsersHandler, loginHandler, registerUserHandler } from './user.controller';
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

  server.post('/login', {
    schema: {
      body: $ref('loginSchema'),
      response: {
        200: $ref('loginResponseSchema')
      }
    }
  }, loginHandler);



  server.get('/', {
    preHandler: [server.auth]
  }, getAllUsersHandler);
};
