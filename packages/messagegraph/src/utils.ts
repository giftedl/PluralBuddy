/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentType } from "discord-api-types/v10";
import type { GraphMessage } from "./base";

export function getAllReliableContents(input: GraphMessage) {
	let finalContents = "";

	for (const component of input.components) {
		if (component.type === ComponentType.TextDisplay) {
			finalContents += component.content;
		}
		if (component.type === ComponentType.Container) {
			for (const containerComponent of component.components) {
				if (containerComponent.type === ComponentType.TextDisplay) {
					finalContents += containerComponent.content;
				}
				if (containerComponent.type === ComponentType.Section) {
					finalContents += containerComponent.components
						.filter((c) => c.type === ComponentType.TextDisplay)
						.map((c) => c.content);
				}
			}
		}
		if (component.type === ComponentType.Section) {
			finalContents += component.components
				.filter((c) => c.type === ComponentType.TextDisplay)
				.map((c) => c.content);
		}
	}

	return finalContents;
}

export function replaceStringFromContents(
	replace: { from: string; to: string }[],
	input: GraphMessage,
): GraphMessage {
	const finalMessage = input;

	const newComponents = finalMessage.components.map((component) => {
		const newComponent = component;

		for (const replacement of replace) {
			if (newComponent.type === ComponentType.TextDisplay) {
				newComponent.content = newComponent.content.replaceAll(
					replacement.from,
					replacement.to,
				);
			}
			if (newComponent.type === ComponentType.Container) {
				const newContainerComponents = newComponent.components.map((component) => {
					if (component.type === ComponentType.TextDisplay) {
						component.content.replaceAll(
                            replacement.from,
                            replacement.to,
                        );
					}
					if (component.type === ComponentType.Section) {
						component.components = component.components
							.filter((c) => c.type === ComponentType.TextDisplay)
                            .map((c) => {
                                c.content = c.content.replaceAll(replacement.from, replacement.to);
                                return c;
                            });
					}

                    return component;
				})

                newComponent.components = newContainerComponents;
			}
			if (newComponent.type === ComponentType.Section) {
				newComponent.components = newComponent.components
					.filter((c) => c.type === ComponentType.TextDisplay)
					.map((c) => {
						c.content = c.content.replaceAll(replacement.from, replacement.to);
						return c;
					});
			}
		}

		return newComponent;
	});

	finalMessage.components = newComponents;

	return finalMessage;
}
