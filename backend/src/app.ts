import Fastify from 'fastify';
import { userRoutes } from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';

const server = Fastify({logger: true});

server.get('/health', (req, res) => {
  return {status: 'OK'};
});

async function main() {
  for (let schema of userSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, {prefix: 'api/users'});

  try {
    await server.listen({port: 3000, host: '0.0.0.0'});

    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
