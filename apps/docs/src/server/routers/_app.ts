import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { AlterRouter } from './alters';
import { ExpressRouter } from './express';
import { ImportStagingRouter } from './import-staging';
import { getDiscordIdBySessionId } from '@/lib/discord-id';
import { Svix } from "svix";
import { systemsAppRouter } from "@/server/routers/app";

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
    "system_apps": systemsAppRouter,

    getDiscordId: baseProcedure.query(async ({ ctx }) => {
      const session = ctx.session;

      if (!session) throw new Error("Session error.");

      return ctx.userId;
    }),
    getSvixUrl: baseProcedure.query(async ({ ctx }) => {
      const session = ctx.session;

      if (!session) throw new Error("Session error.");

      const svix = new Svix(process.env.SVIX_KEY as string);

      await svix.application.getOrCreate({
        name: `Webhooks - ${ctx.userId}`,
        uid: ctx.userId
      })
      const dashboard = await svix.authentication.appPortalAccess(ctx.userId, {});

      return dashboard.url;
    })

});

// export type definition of API
export type AppRouter = typeof appRouter;