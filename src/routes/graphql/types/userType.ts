import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { PostType } from './postType.js';
import { GqlContext } from './types.js';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profileType.js';

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
