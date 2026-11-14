import { startStatisticalTimer } from "@/analytics";
import { initializeApplicationCommands } from "@/lib/mention-command";
import { analyticsCollection } from "@/mongodb";
import { createEvent } from "seyfert";

export default createEvent({
<<<<<<< HEAD
  data: { name: "ready", once: true },
  run: async (user, client) => {
    await initializeApplicationCommands();
    if (analyticsCollection !== undefined) startStatisticalTimer();
  },
=======
	data: { name: "ready", once: true },
	run: async (user, client) => {
		await initializeApplicationCommands();
		if (analyticsCollection !== undefined) startStatisticalTimer();

		// The env is not needed for DEV.
		// This is production only.
		// startUptimeHeartbeat(client);
	},
>>>>>>> 2bc1cfa15f9539ae844af4a92ea7b0715d42df63
});
