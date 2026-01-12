/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ComponentType,
	MessageFlags,
	type APIBaseMessage,
	type APIMessageTopLevelComponent,
	type APITextDisplayComponent,
    type RESTPostAPIChannelMessageJSONBody,
} from "discord-api-types/v10";
import type { GraphModule } from "./module";

type GraphBaseConstructor = {
	modules: GraphModule[];
};

export type GraphMessage = RESTPostAPIChannelMessageJSONBody & { components: APIMessageTopLevelComponent[] };

export class GraphBase {
	options: GraphBaseConstructor;
	input: string;

	constructor(input: string, options: GraphBaseConstructor) {
		this.options = options;
		this.input = input;
	}

	async message() {
		const currentModules = this.options.modules;
		let currentComponents: GraphMessage = {
			components: [
				{
					type: ComponentType.TextDisplay,
					content: this.input,
				} satisfies APITextDisplayComponent,
			],
            flags: MessageFlags.IsComponentsV2
		};

		for (const module of currentModules) {
			if (module.options.requireCondition)
				currentComponents = await module.message(currentComponents);
		}

		return currentComponents;
	}

	postActions() {
		const currentModules = this.options.modules;

		for (const module of currentModules) {
            module.postActions
        }
    }
}
