import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { PTerminology } from "../../pluralbuddy/terminology";
import { UnauthorizedSchema } from "../utils";

export const register = (registry: OpenAPIRegistry) =>
    registry.registerPath({
        method: "post",
        path: "/v1/users/{user}/terminology",
        summary: "Modify a user's terminology",
        description:
            "Modify specific data about a user's terminology. `{user}` can be `@me` to target the current OAuth user.",
        security: [{ oAuth2: ["system:write"] }],
        parameters: [
            {
                name: "user",
                in: "path",
                required: true,
                description:
                    "`{user}` is a Discord user Snowflake, or `@me`, referencing the current OAuth user.",
                schema: {
                    type: "string",
                },
            },
        ],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: PTerminology.nonoptional()
                    }
                }
            }
        },
        responses: {
            "200": {
                description: "Success.",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: z.literal(true)
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
        },
    });
