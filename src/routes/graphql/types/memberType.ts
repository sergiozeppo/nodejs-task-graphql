import { GraphQLEnumType, GraphQLObjectType, GraphQLFloat, GraphQLInt } from 'graphql';
import { MemberTypeIdType } from './enums.js';

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
