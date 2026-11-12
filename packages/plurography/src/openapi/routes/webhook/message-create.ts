import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { PMessageObject } from "@/pluralbuddy/message";

export const register = (registry: OpenAPIRegistry) =>
  registry.registerWebhook({
    method: "post",
    path: "message.create",
    summary: "Receive alter creation updates",
    description: "Receive message creation updates via Svix Webhooks built into PluralBuddy.",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              userId: z.string(),
              type: z.literal("message.create"),
              message: PMessageObject,
            }),
          },
        },
      },
    },
    responses: {},
  });
