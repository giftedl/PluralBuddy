import { PAlterObject } from "../../pluralbuddy/alter";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UnauthorizedSchema } from "../utils";
import z from "zod";

export const register = (registry: OpenAPIRegistry) =>
  registry.registerPath({
    method: "delete",
    path: "/v1/users/{user}/alters/{alter}",
    summary: "Delete a system alter",
    description:
      "Delete a system alter by its ID. `{user}` can be `@me` to target the current OAuth user.",
    security: [{ oAuth2: ["alters:write"] }],
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
      {
        name: "alter",
        in: "path",
        required: true,
        description: "`{alter}` is the alter ID.",
        schema: {
          type: "string",
        },
      },
    ],
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
              type: z.literal("unknown-alter"),
              friendly: z.literal("Couldn't find this alter."),
            }),
          },
        },
      },
    },
  });
