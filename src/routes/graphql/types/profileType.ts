import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import { MemberType } from './memberType.js';
import { GqlContext } from './types.js';
import { UUIDType } from './uuid.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
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
