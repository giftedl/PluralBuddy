import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { AlterRouter } from './alters';
import { ExpressRouter } from './express';
import { ImportStagingRouter } from './import-staging';
import { getDiscordIdBySessionId } from '@/lib/discord-id';

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
    "alters": AlterRouter,
    "express": ExpressRouter,
    "import_staging": ImportStagingRouter,

    getDiscordId: baseProcedure.query(async ({ ctx }) => {
      const session = ctx.session;

      if (!session) throw new Error("Session error.");

      return await getDiscordIdBySessionId(session.user.id);
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;