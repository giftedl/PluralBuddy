import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { PAlterObject } from "@/pluralbuddy/alter";

export const register = (registry: OpenAPIRegistry) =>
  registry.registerWebhook({
    method: "post",
    path: "alter.create",
    summary: "Receive alter creation updates",
    description: "Receive alter creation updates via Svix Webhooks built into PluralBuddy.",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              userId: z.string(),
              type: z.literal("alter.create"),
              alter: PAlterObject,
            }),
          },
        },
      },
    },
    responses: {},
  });
