import type { Client } from "seyfert";
import { Yuna } from "yunaforseyfert";

export function yunaForSeyfert() {
	return Yuna.plugin({
		parser: true,

		resolver: {
			afterPrepare: function (this, metadata) {
				this.logger.debug(`Ready to use ${metadata.commands.length} commands !`);
			},
		},
	});
}
