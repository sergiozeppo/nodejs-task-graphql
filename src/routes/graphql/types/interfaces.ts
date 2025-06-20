export interface CreateProfile {
  userId: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}

export interface CreatePost {
  title: string;
  content: string;
  authorId: string;
}

export interface CreateUser {
  name: string;
  balance: number;
}
