import { PAlterObject } from "@/pluralbuddy/alter";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UnauthorizedSchema } from "../utils";
import z from "zod";

export const register = (registry: OpenAPIRegistry) => registry.registerPath({
    method: "post",
    path: "/v1/users/{user}/alters/{tag}/edit",
    summary: "Edit a system alter",
    description:
        "Edit a system alter by its ID. `{user}` can be `@me` to target the current OAuth user.",
    security: [{ oAuth2: ["alters:write"] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: PAlterObject.omit({
                        tagIds: true,
                        alterId: true,
                        systemId: true,
                        created: true,
                        lastMessageTimestamp: true,
                        messageCount: true,
                    })
                        .partial()
                        .default({}),
                },
            },
        },
    },
    responses: {
        "200": {
            description: "Success.",
            content: {
                "application/json": {
                    schema: PAlterObject,
                },
            },
        },
        "400": {
            description: "Client error while processing input.",
            content: {
                "application/json": {
                    schema: z.object({
                        errors: z.array(
                            z.object({
                                type: z.enum(["not-matching-oauth", "zod"]),
                                friendly: z.string(),
                            }),
                        ),
                    }),
                },
            },
        },
        "401": {
            description: "No access token when authenticating.",
            content: {
                "application/json": {
                    schema: UnauthorizedSchema,
                },
            },
        },
        "404": {
            description: "Couldn't find the alter",
            content: {
                "application/json": {
                    schema: z.object({
                        type: z.literal("unknown-alter"),
                        friendly: z.literal("Couldn't find this alter."),
                    }),
                },
            },
        },
    },
});