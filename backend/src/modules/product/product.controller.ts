import { FastifyReply, FastifyRequest } from 'fastify';

import { TCreateProductInput } from './product.schema';
import { createProduct, getProducts } from './product.service';

export const createProductHandler = async (request: FastifyRequest<{
  Body: TCreateProductInput
}>, reply: FastifyReply) => {
  try {
    const product = await createProduct({
      ...request.body,
      ownerId: request.user.id,
    });

    return reply.code(201).send(product);
  } catch (err) {
    console.error(err);
    return reply.code(500).send(err);
  }
};

export const getProductHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const products = await getProducts();

    return reply.code(200).send(products);
  } catch (err) {
    console.error(err);
    return reply.code(500).send(err);
  }
};
