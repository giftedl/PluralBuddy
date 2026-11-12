/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { DiscordSnowflake } from "@sapphire/snowflake";

/**
 * Used for types in the API that could be redacted due to privacy policies set in place by the system owner.
 */
export type Redacted<T> =
  | { [P in keyof T]?: T[P] | { redacted: true } }
  | { redacted: true }
  | null;

export const createRandomId = (i: number) => {
  const date = new Date();
  date.setSeconds(i);

  return Number(
    DiscordSnowflake.generate({
      timestamp: date,
      workerId: BigInt(i),
      processId: BigInt(Math.floor(Math.random() * 1000)),
    }),
  );
};
