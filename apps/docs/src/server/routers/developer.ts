import z from "zod";
import { baseProcedure } from "../init";
import { router } from "../trpc";
import { MongoClient, ObjectId } from "mongodb";
import { waitUntil } from "@vercel/functions";
import { PIntegrationFront } from "plurography";

const parkedIds = [
  "status",
  "alter",
  "clear-latch",
  "a",
  "cl",
  "l",
  "lch",
  "latch",
  "off",
  "shutup",
] as const;

export const DeveloperRouter = router({
  updateAIAPID: baseProcedure
    .input(
      z.object({
        newId: z
          .string()
          .min(1)
          .max(40)
          .refine((id) => !parkedIds.includes(id as (typeof parkedIds)[0]), {
            message: "ID cannot be a native auto-proxy command.",
          })
          .refine((id) => !id.includes(" "), {
            message: "Cannot contain spaces.",
          }),
        integrationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      if (!session) throw new Error("Session error.");

      const client = new MongoClient(process.env.MONGO ?? "");
      await client.connect();

      const clients = client.db(`${process.env.ENV}-pluralbuddy-app`).collection("oauthClient");
      const db = client.db(`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`);
      const fronts = db.collection<PIntegrationFront>("fronts");
      const existing = await clients.findOne({ "metadata.aaid": input.newId });

      if (existing) throw new Error("Already taken.");

      const modified = await clients.updateOne(
        {
          $and: [{ userId: new ObjectId(session.user.id) }, { clientId: input.integrationId }],
        },
        { $set: { "metadata.aaid": input.newId } },
      );

      if (modified.modifiedCount !== 1) throw new Error("Failed to find OAuth client");

      await fronts.updateMany({ clientId: input.integrationId }, { $set: { aiapId: input.newId } });

      return { success: true };
    }),
});
