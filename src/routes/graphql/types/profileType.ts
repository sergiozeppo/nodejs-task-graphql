import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLString } from 'graphql';
import { MemberType } from './memberType.js';
import { GqlContext } from './types.js';
import { UUIDType } from './uuid.js';

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
