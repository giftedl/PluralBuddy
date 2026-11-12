import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UnauthorizedSchema } from "../utils";
import z from "zod";

export const register = (registry: OpenAPIRegistry) =>
  registry.registerPath({
    method: "post",
    path: "/v1/users/{user}/front",
    summary: "Front an alter",
    description: "Push an alter to front with [AI/AP](/docs/pluralbuddy/ai-ap).",
    security: [{ oAuth2: ["system:ai-ap"] }],
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
            schema: z.object({
              alter: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Success.",
        content: {
          "application/json": {
            schema: z.object({
              success: z.literal(true),
            }),
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
              type: z.enum(["unknown-alter", "no-ai-ap-id", "no-client-id", "not-matching-oauth"]),
              friendly: z.enum([
                "Unable to find the specific alter.",
                "There is no assigned AI/AP ID which is required to set a front.",
                "Unable to find the client ID for this OAuth application.",
                "This endpoint requires the user currently logged in via OAuth.",
              ]),
            }),
          },
        },
      },
    },
  });
