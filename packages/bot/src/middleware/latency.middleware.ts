import { latencyDataPoints } from "@/analytics";
import { createMiddleware } from "seyfert";

export const latency = createMiddleware<void>(async (middle) => {
	latencyDataPoints.push(
		Date.now() -
			// @ts-ignore
			(middle.context.message ?? middle.context.interaction).createdTimestamp,
	);

	return middle.next();
});
