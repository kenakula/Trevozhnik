import { prisma } from '../../utils/prisma';
import { TCreateProductInput } from './product.schema';

export const createProduct = async (data: TCreateProductInput & {ownerId: number}) => {
  return prisma.product.create({
    data
  });
};

export const getProducts = async () => {
  return prisma.product.findMany({
    select: {
      content: true,
      title: true,
      price: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      ownerId: true,
      owner: {
        select: {
          name: true,
          id: true,
        }
      }
    }
  });
};
