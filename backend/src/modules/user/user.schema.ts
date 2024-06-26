import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

const userCore = {
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  }).email(),
  name: z.string(),
};

const createUserScheme = z.object({
  ...userCore,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

const getAllUsersResponseSchema = z.array(createUserResponseSchema);

const loginSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  }).email(),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type TCreateUserInput = z.infer<typeof createUserScheme>;
export type TLoginInput = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  loginSchema,
  createUserScheme,
  loginResponseSchema,
  createUserResponseSchema,
  getAllUsersResponseSchema
}, { $id: 'UserSchema' });
