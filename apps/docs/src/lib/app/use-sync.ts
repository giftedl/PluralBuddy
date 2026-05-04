import { useTRPCClient } from "@/server/client";
import { useMutation } from "@tanstack/react-query";
import Pako from "pako";
import { PAlterObject, PSystemObject, PTagObject } from "plurography";
import z from "zod";
import { db } from "./dexie";
import { authClient } from "../auth-client";

export const importSyntax = z.object({
	system: PSystemObject.or(z.null()),
	alters: PAlterObject.array().max(2000),
	tags: PTagObject.array().max(2000),
});

export function useSyncMutation(t: ReturnType<typeof useTRPCClient>) {
	const syncMutation = useMutation({
		mutationFn: async (data: {
			data: z.infer<typeof importSyntax>;
			prefer: "local" | "remote";
		}) => {
			const text = Pako.deflate(JSON.stringify(data.data));

			const r = await t.system_apps.sync.mutate({
				data: text.toBase64(),
				prefer: data.prefer,
			});

			const response: z.infer<typeof importSyntax> = JSON.parse(
				new TextDecoder().decode(
					Uint8Array.from(Pako.inflate(Uint8Array.fromBase64(r.data))),
				),
			);

			if (response.system) await db.systems.update("@me", response.system);
			else await db.systems.delete("@me");
		},
	});
	const emptyMutation = useMutation({
		mutationFn: async (data: {
			data: z.infer<typeof importSyntax>;
			prefer: "local" | "remote";
		}) => {
			// no-op mutation for when user is not logged in
		}
	})

	const {data} = authClient.useSession();

	if (!data)
		return emptyMutation;

	return syncMutation;
}

export const gatherPayload = async () => ({
	system: (await db.systems.get("@me")) ?? null,
	alters: [],
	tags: [],
});

const QUICK_SYNC_THROTTLE_MS = 5000;
let lastQuickSyncTime = 0;
let scheduledPromise: Promise<void> | null = null;
let scheduledTimeout: NodeJS.Timeout | null = null;

export function useQuickSync() {
	const t = useTRPCClient();
	const {data} = authClient.useSession();
	const syncMutation = useSyncMutation(t);

	if (!data)
		return async () => {};

	return async () => {
		const now = Date.now();

		if (scheduledPromise) {
			return scheduledPromise;
		}

		if (now - lastQuickSyncTime >= QUICK_SYNC_THROTTLE_MS) {
			// Run immediately
			lastQuickSyncTime = now;
			return syncMutation.mutateAsync({
				data: await gatherPayload(),
				prefer: "local",
			});
		} else {
			// Schedule to run after the throttle window
			const delay = QUICK_SYNC_THROTTLE_MS - (now - lastQuickSyncTime);
			scheduledPromise = new Promise<void>((resolve) => {
				scheduledTimeout = setTimeout(async () => {
					lastQuickSyncTime = Date.now();
					try {
						await syncMutation.mutateAsync({
							data: await gatherPayload(),
							prefer: "local",
						});
					} finally {
						scheduledPromise = null;
						scheduledTimeout = null;
					}
					resolve();
				}, delay);
			});
			return scheduledPromise;
		}
	};
}
