import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { MemberTypeId } from './memberType.js';
import { UUIDType } from './uuid.js';

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
  },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    yearOfBirth: { type: GraphQLInt },
    isMale: { type: GraphQLBoolean },
    memberTypeId: { type: MemberTypeId },
  },
});
