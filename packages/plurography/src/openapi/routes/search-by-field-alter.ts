import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UnauthorizedSchema } from "../utils";
import { PAlterObject } from "../../pluralbuddy/alter";

export const register = (registry: OpenAPIRegistry) =>
  registry.registerPath({
    method: "get",
    path: "/v1/users/{user}/fields/alters/{id}",
    summary: "Get an alter by integration field",
    description:
      "Get data about a specific alter by integration field. `{user}` can be `@me` to target the current OAuth user.",
    security: [{ oAuth2: ["alters:read"] }],
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
        name: "id",
        in: "path",
        required: true,
        description: "`{id}` is the field contents.",
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
            schema: PAlterObject,
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
