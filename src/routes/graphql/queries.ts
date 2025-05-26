import { GraphQLNonNull, GraphQLList, GraphQLObjectType } from 'graphql';
import { GqlContext } from './types/types.js';
import { UUIDType } from './types/uuid.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { MemberTypeIdType } from './types/enums.js';
import { PostType } from './types/postType.js';
import { UserType } from './types/userType.js';
import { MemberType, MemberTypeId } from './types/memberType.js';
import { ProfileType } from './types/profileType.js';

export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_, __, context: GqlContext, info) => {
        const resolveTree = parseResolveInfo(info) as ResolveTree;
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          resolveTree,
          info.returnType,
        );

        const include: {
          subscribedToUser?: boolean;
          userSubscribedTo?: boolean;
        } = {};

        if (Object.prototype.hasOwnProperty.call(fields, 'subscribedToUser')) {
          include.subscribedToUser = true;
        }

        if (Object.prototype.hasOwnProperty.call(fields, 'userSubscribedTo')) {
          include.userSubscribedTo = true;
        }

        return context.prisma.user.findMany({ include });
      },
    },

    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: GqlContext) => {
        return context.prisma.user.findUnique({
          where: { id },
        });
      },
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: (_, __, context: GqlContext) => {
        return context.prisma.profile.findMany();
      },
    },

    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }: { id: string }, context: GqlContext) => {
        return context.prisma.profile.findUnique({
          where: { id },
        });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: (_, __, context: GqlContext) => {
        return context.prisma.post.findMany();
      },
    },

    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }: { id: string }, context: GqlContext) => {
        return context.prisma.post.findUnique({
          where: { id },
        });
      },
    },

    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: (_, __, context: GqlContext) => {
        return context.prisma.memberType.findMany();
      },
    },

    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: (_, { id }: { id: MemberTypeIdType }, context: GqlContext) => {
        return context.prisma.memberType.findUnique({
          where: { id },
        });
      },
    },
  },
});
