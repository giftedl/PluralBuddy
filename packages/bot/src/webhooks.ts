import { Svix } from "svix";

export const svix = new Svix(process.env.SVIX_KEY ?? "");

export function w(userId: string, type: string, payload: any) {
	(async () => {
        try {

            const application = await svix.application.getOrCreate({
                name: `Webhooks - ${userId}`,
                uid: userId,
            }).catch(v => null);
    
            if (!application)
                return;
    
            await svix.message.create(userId, {
                eventType: type,
                payload,
            });
        } catch(_) {}
	})();
}
