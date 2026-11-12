import { UnauthorizedSchema } from "../utils";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";

export const register = (registry: OpenAPIRegistry) =>
  registry.registerPath({
    method: "delete",
    path: "/v1/users/{user}/tags/{tag}",
    summary: "Delete a system tag",
    description:
      "Delete a system tag by its ID. `{user}` can be `@me` to target the current OAuth user.",
    security: [{ oAuth2: ["tags:write"] }],
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
        name: "tag",
        in: "path",
        required: true,
        description: "`{tag}` is the tag ID.",
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
        description: "Couldn't find the tag",
        content: {
          "application/json": {
            schema: z.object({
              type: z.literal("unknown-tag"),
              friendly: z.literal("Couldn't find this tag."),
            }),
          },
        },
      },
    },
  });
