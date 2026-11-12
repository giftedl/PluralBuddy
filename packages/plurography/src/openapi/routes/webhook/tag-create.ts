import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { PTagObject } from "@/pluralbuddy/tag";

export const register = (registry: OpenAPIRegistry) =>
  registry.registerWebhook({
    method: "post",
    path: "tag.create",
    summary: "Receive tag creation updates",
    description: "Receive tag creation updates via Svix Webhooks built into PluralBuddy.",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              userId: z.string(),
              type: z.literal("tag.create"),
              tag: PTagObject,
            }),
          },
        },
      },
    },
    responses: {},
  });
