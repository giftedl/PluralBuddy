import { PAlterObject } from "@/pluralbuddy/alter";
import { PSystemObject } from "@/pluralbuddy/system";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";

export const register = (registry: OpenAPIRegistry) =>
    registry.registerWebhook({
        method: "post",
        path: "system.update",
        summary: "Receive system updates",
        description:
            "Receive system updates via Svix Webhooks built into PluralBuddy.",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: z.object({
                            userId: z.string(),
                            type: z.literal("system.update"),
                            system: PSystemObject,
                        }),
                    },
                },
            },
        },
        responses: {},
    });
