/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { Tupper } from "./tupper";
import { TupperBoxGroup } from "./group";

export const TupperBoxSystem = z.object({
    tuppers: Tupper.array(),
    groups: TupperBoxGroup.array()
})