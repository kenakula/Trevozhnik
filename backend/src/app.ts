import fastifyJwt from '@fastify/jwt';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';

import { productRoutes } from './modules/product/product.route';
import { productSchemas } from './modules/product/product.schema';
import { userRoutes } from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';

declare module 'fastify' {
  export interface FastifyInstance {
    // eslint-disable-next-line
    auth: any;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      email: string;
      name: string;
      id: number;
    }
  }
}

export const server = Fastify({ logger: true });

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET ?? '',
});

server.decorate('auth', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.code(401).send(err);
  }
});

server.get('/health', () => {
  return { status: 'OK' };
});

async function main() {
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  server.register(userRoutes, { prefix: 'api/users' });
  server.register(productRoutes, { prefix: 'api/products' });

  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });

    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
