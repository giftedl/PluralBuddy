/**
 * PluralBuddy Discord Bot
 *  - is licensed under MIT License.
 */

import { z } from "zod";

export const PrivacyLevel = z.enum([ "public", "private" ])

