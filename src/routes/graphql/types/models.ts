import { MemberTypeId } from '../../member-types/schemas.js';

export type Member = {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
};

export type Profile = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: MemberTypeId;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export type User = {
  id: string;
  name: string;
  balance: number;
};
