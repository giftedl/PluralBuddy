import { addBreadcrumb } from "@sentry/bun";
import { createMiddleware } from "seyfert";
import { discordApiLatency } from "@/analytics";

export const latency = createMiddleware<void>(async (middle) => {
	if (!middle.context.guildId) return middle.next();
	
	discordApiLatency.observe(
		Date.now() -
			// @ts-expect-error
			(middle.context.message ?? middle.context.interaction).createdTimestamp,
	);
	addBreadcrumb({
		category: "components",
		message: `Handling component/command: ${middle.context.isComponent() || middle.context.isModal() ? middle.context.customId : middle.context.fullCommandName}`,
		level: "info",
	});

	return middle.next();
});
