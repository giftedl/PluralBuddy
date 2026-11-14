/**
 * PluralBuddy Discord Bot
 *  - is licensed under Apache License 2.0.
 */

import z from "zod";

export const PrivacyLevel = z.enum(["public", "private"]);
