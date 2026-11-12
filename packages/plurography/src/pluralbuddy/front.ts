import z from "zod";

export const PIntegrationFront = z.object({
  alterId: z.string(),
  timestamp: z.coerce.date(),
  clientId: z.string(),
  aiapId: z.string(),
  systemId: z.string(),
});

export type PIntegrationFront = z.infer<typeof PIntegrationFront>;
