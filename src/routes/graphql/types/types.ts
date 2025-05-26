import { PrismaClient } from '@prisma/client';

export type GqlContext = {
  prisma: PrismaClient;
};
