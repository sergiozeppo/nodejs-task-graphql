import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlRootSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, res) {
      const { query, variables } = req.body;

      const errorsValidate = validate(gqlRootSchema, parse(query), [depthLimit(5)]);
      if (errorsValidate.length > 0) {
        await res.send({ errors: errorsValidate });
      }

      const result = await graphql({
        source: query,
        variableValues: variables,
        schema: gqlRootSchema,
        contextValue: { prisma },
      });

      return result;
    },
  });
};

export default plugin;
