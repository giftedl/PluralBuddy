/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

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
