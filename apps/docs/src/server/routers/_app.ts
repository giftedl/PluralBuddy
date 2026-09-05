import { Svix } from "svix";
import { z } from 'zod';
import { getDiscordIdBySessionId } from '@/lib/discord-id';
import { baseProcedure, createTRPCRouter } from '../init';
import { AccountRouter } from './account';
import { AlterRouter } from './alters';
import { DeveloperRouter } from './developer';
import { ExpressRouter } from './express';
import { ImportStagingRouter } from './import-staging';
import { ImportTranscriptRouter } from './import-transcript';
import { SocialRouter } from './social';

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
    "import_transcripts": ImportTranscriptRouter,
    developers: DeveloperRouter,
    social: SocialRouter,
    account: AccountRouter,

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