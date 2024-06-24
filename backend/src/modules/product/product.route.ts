import { FastifyInstance } from 'fastify';

import { createProductHandler, getProductHandler } from './product.controller';
import { $ref } from './product.schema';

export const productRoutes = async (server: FastifyInstance) => {
  server.post('/', {
    preHandler: [server.auth],
    schema: {
      body: $ref('createProductSchema'),
      response: {
        201: $ref('productResponseSchema')
      }
    }
  }, createProductHandler);

  server.get('/', {
    preHandler: [server.auth],
    schema: {
      response: {
        200: $ref('productsResponseSchema')
      }
    }
  }, getProductHandler);
};
