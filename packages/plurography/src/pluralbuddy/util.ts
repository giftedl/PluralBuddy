/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

/**
 * Used for types in the API that could be redacted due to privacy policies set in place by the system owner.
 */
export type Redacted<T> = { [P in keyof T]?: T[P] | { redacted: true }; } | { redacted: true } | null;