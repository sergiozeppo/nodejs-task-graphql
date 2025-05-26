import { GraphQLSchema } from 'graphql';
import { Mutation } from './mutations/mutations.js';
import { Query } from './queries.js';
import { Type } from '@fastify/type-provider-typebox';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const gqlRootSchema = new GraphQLSchema({
  mutation: Mutation,
  query: Query,
});
