import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const register = (registry: OpenAPIRegistry) =>
  registry.registerPath({
    method: "post",
    tags: ["Device-authorization"],
    description:
      "Request a device and user code\n\nFollow [rfc8628#section-3.2](https://datatracker.ietf.org/doc/html/rfc8628#section-3.2)",
    security: [
      {
        bearerAuth: [],
      },
    ],
    path: "/auth/device/code",
    responses: {
      "200": {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                device_code: {
                  type: "string",
                  description: "The device verification code",
                },
                user_code: {
                  type: "string",
                  description: "The user code to display",
                },
                verification_uri: {
                  type: "string",
                  format: "uri",
                  description:
                    "The URL for user verification. Defaults to /device if not configured.",
                },
                verification_uri_complete: {
                  type: "string",
                  format: "uri",
                  description: "The complete URL with user code as query parameter.",
                },
                expires_in: {
                  type: "number",
                  description: "Lifetime in seconds of the device code",
                },
                interval: {
                  type: "number",
                  description: "Minimum polling interval in seconds",
                },
              },
            },
          },
        },
      },
      "400": {
        description: "Error response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  enum: [
                    "invalid_request",
                    "invalid_client",
                    "unauthorized_client",
                    "invalid_scope",
                    "invalid_target",
                  ],
                },
                error_description: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      "401": {
        description: "Invalid Basic client authentication",
        headers: {
          "WWW-Authenticate": {
            description: "Basic client authentication challenge",
            schema: {
              type: "string",
              example: "Basic",
            },
          },
        },
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  enum: ["invalid_client"],
                },
                error_description: {
                  type: "string",
                },
              },
              required: ["error"],
            },
          },
        },
      },
      "403": {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
        description:
          "Forbidden. You do not have permission to access this resource or to perform this action.",
      },
      "404": {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
        description: "Not Found. The requested resource was not found.",
      },
      "429": {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
        description: "Too Many Requests. You have exceeded the rate limit. Try again later.",
      },
      "500": {
        description: "Server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  enum: ["server_error"],
                },
                error_description: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
    parameters: [],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              client_id: {
                type: "string",
              },
              user_id: {
                type: "string",
                description: "The user ID to which the device code should be pre-bound.",
              },
              scope: {
                type: "string",
                description: "Space-separated list of scopes",
              },
              client_secret: {
                type: "string",
                description: "OAuth client secret",
              },
              client_assertion: {
                type: "string",
                description: "OAuth client assertion",
              },
              client_assertion_type: {
                type: "string",
                description: "OAuth client assertion type",
              },
              resource: {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  {
                    enum: [""],
                  },
                ],
                description: "RFC 8707 resource indicator(s) to bind to this authorization request",
              },
            },
          },
        },
      },
    },
  });
