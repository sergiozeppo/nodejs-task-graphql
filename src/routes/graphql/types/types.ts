import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from './uuid.js';
import { MemberTypeIdType } from './enums.js';

export type GqlContext = {
  prisma: PrismaClient;
};

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: MemberTypeIdType.BASIC },
    BUSINESS: { value: MemberTypeIdType.BUSINESS },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: GraphQLString },
    memberType: {
      type: MemberType,
      resolve: async (parent: { memberTypeId: string }, _, context: GqlContext) => {
        return await context.prisma.memberType.findUnique({
          where: { id: parent.memberTypeId },
        });
      },
    },
  }),
});

export const UserType: GraphQLObjectType<{ id: string }, GqlContext> =
  new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: UUIDType },
      name: { type: GraphQLString },
      balance: { type: GraphQLFloat },

      profile: {
        type: ProfileType,
        resolve: async (parent, _, context) => {
          return await context.prisma.profile.findUnique({
            where: { userId: parent.id },
          });
        },
      },

      posts: {
        type: new GraphQLList(PostType),
        resolve: async (parent, _, context) => {
          return await context.prisma.post.findMany({
            where: { authorId: parent.id },
          });
        },
      },

      userSubscribedTo: {
        type: new GraphQLList(UserType),
        resolve: async (parent, _, context) => {
          const subscriptions = await context.prisma.subscribersOnAuthors.findMany({
            where: { subscriberId: parent.id },
            include: { author: true },
          });
          return subscriptions.map((sub) => sub.author);
        },
      },

      subscribedToUser: {
        type: new GraphQLList(UserType),
        resolve: async (parent, _, context) => {
          return await context.prisma.user.findMany({
            where: {
              userSubscribedTo: {
                some: { authorId: parent.id },
              },
            },
          });
        },
      },
    }),
  });
