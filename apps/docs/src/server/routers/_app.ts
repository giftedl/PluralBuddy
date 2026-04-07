import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { AlterRouter } from './alters';
import { ExpressRouter } from './express';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
    AlterRouter,
    ExpressRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;