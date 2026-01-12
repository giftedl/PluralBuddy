/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { GraphMessage } from "./base";

export type GraphModuleDefaultOptions = { requireCondition?: boolean | undefined };

export class GraphModule {
    options: GraphModuleDefaultOptions;

    constructor(opts: GraphModuleDefaultOptions) {
        this.options = opts;
    }

    async message(input: GraphMessage): Promise<GraphMessage> {
        return input;
    }

    async postActions() {}
}