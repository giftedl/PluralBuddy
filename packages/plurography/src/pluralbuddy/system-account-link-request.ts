import z from "zod";

export const PSystemAccountLinkRequestObject = z.object({
	requestId: z.string().uuid(),
	systemId: z.string(),
	targetAccountId: z.string(),
	requestedBy: z.string(),
	createdAt: z.coerce.date(),
	expiresAt: z.coerce.date(),
});

export type PSystemAccountLinkRequest = z.infer<
	typeof PSystemAccountLinkRequestObject
>;
