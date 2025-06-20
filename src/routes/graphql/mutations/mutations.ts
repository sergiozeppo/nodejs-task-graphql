import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { GqlContext } from '../types/types.js';
import { CreatePost, CreateUser, CreateProfile } from '../types/interfaces.js';
import { PostType } from '../types/postType.js';
import { ProfileType } from '../types/profileType.js';
import { UserType } from '../types/userType.js';
import { CreateUserInput, ChangeUserInput } from '../types/userInputType.js';
import { CreatePostInput, ChangePostInput } from '../types/postInputType.js';
import { CreateProfileInput, ChangeProfileInput } from '../types/profileInputType.js';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      async resolve(_, { dto }: { dto: CreatePost }, context: GqlContext) {
        return context.prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (
        _,
        { id, dto }: { id: string; dto: CreatePost },
        context: GqlContext,
      ) => {
        return context.prisma.post.update({ where: { id }, data: dto });
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: GqlContext) => {
        try {
          await context.prisma.post.delete({ where: { id } });
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },
    },
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_, { dto }: { dto: CreateUser }, context: GqlContext) => {
        return context.prisma.user.create({ data: dto });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (
        _,
        { id, dto }: { id: string; dto: CreateUser },
        context: GqlContext,
      ) => {
        return context.prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: GqlContext) => {
        await context.prisma.user.delete({ where: { id } });
        return true;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        args: { userId: string; authorId: string },
        context: GqlContext,
      ) => {
        const { userId: subscriberId, authorId } = args;
        await context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: subscriberId,
            authorId: authorId,
          },
        });
        return 'done';
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        args: { userId: string; authorId: string },
        context: GqlContext,
      ) => {
        const { userId: subscriberId, authorId } = args;
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: { subscriberId: subscriberId, authorId },
          },
        });
        return true;
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_, { dto }: { dto: CreateProfile }, context: GqlContext) => {
        return context.prisma.profile.create({ data: dto });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (
        _,
        { id, dto }: { id: string; dto: Partial<CreateProfile> },
        context: GqlContext,
      ) => {
        return context.prisma.profile.update({ where: { id }, data: dto });
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: GqlContext) => {
        try {
          await context.prisma.profile.delete({ where: { id } });
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },
    },
  },
});
