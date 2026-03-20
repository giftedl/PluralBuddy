import { indexingMessageMap } from "@/events/on-message-create";
import type { ContainerComponent } from "seyfert/lib/components/Container";
import type { TextDisplayComponent } from "seyfert/lib/components/TextDisplay";
import { ComponentType } from "seyfert/lib/types";

export async function cleanupIndexingMap() {
	for (const [user, message] of Object.entries(indexingMessageMap)) {
		if (
			message.components[0] &&
			message.components[0].type === ComponentType.Container
		) {
			const container = message.components[0] as ContainerComponent;

			if (
				container.components[0] &&
				container.components[0].type === ComponentType.TextDisplay &&
				(container.components[0] as TextDisplayComponent).content.endsWith("-# **Current Status:** 0% indexed.")
			) {
				setTimeout(async () => {
					const newMessage = await message.fetch();
					if (
						newMessage.components[0] &&
						newMessage.components[0].type === ComponentType.Container
					) {
						const container = newMessage.components[0] as ContainerComponent;

						if (
							container.components[0] &&
							container.components[0].type === ComponentType.TextDisplay &&
							(container.components[0] as TextDisplayComponent).content.endsWith("-# **Current Status:** 0% indexed.")
						) {
							await message.delete();
							delete indexingMessageMap[user]
						}
					}
				}, 4000);
			}
		}
	}
}

export function startIndexingCleanupTimer() {
    setInterval(() => {
        cleanupIndexingMap()
    }, 4000);
}