import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { AlterRouter } from './alters';
import { ExpressRouter } from './express';
import { ImportStagingRouter } from './import-staging';
import { getDiscordIdBySessionId } from '@/lib/discord-id';
import { Svix } from "svix";

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
    }),
    getSvixUrl: baseProcedure.query(async ({ ctx }) => {
      const session = ctx.session;

      if (!session) throw new Error("Session error.");

      const svix = new Svix(process.env.SVIX_KEY as string); 
      const userId = await getDiscordIdBySessionId(session.user.id)

      await svix.application.getOrCreate({
        name: `Webhooks - ${userId}`,
        uid: userId
      })
      const dashboard = await svix.authentication.appPortalAccess(userId, {});

      return dashboard.url;
    })

});

// export type definition of API
export type AppRouter = typeof appRouter;