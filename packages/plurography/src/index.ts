/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { PluralKitConfiguration, PluralKitSystem } from "./pluralkit";
import { PluralKitGroup } from "./pluralkit/group";
import { PluralKitMember } from "./pluralkit/member";
import { TupperBoxSystem } from "./tupperbox";
import { TupperBoxGroup } from "./tupperbox/group";
import { Tupper } from "./tupperbox/tupper";
import { SimplyPluralMember } from "./simplyplural/alter";
import { SimplyPluralSystem } from "./simplyplural";
import { SimplyPluralGroup } from "./simplyplural/group";

export {
	PluralKitConfiguration,
	PluralKitGroup,
	PluralKitMember,
	PluralKitSystem,
};
export { Tupper, TupperBoxGroup, TupperBoxSystem };
export { SimplyPluralSystem, SimplyPluralMember, SimplyPluralGroup }

export * from "./pluralbuddy/alter";
export * from "./pluralbuddy/auto-proxy";
export * from "./pluralbuddy/guild";
export * from "./pluralbuddy/message";
export * from "./pluralbuddy/operation";
export * from "./pluralbuddy/system";
export * from "./pluralbuddy/tag";
export * from "./pluralbuddy/privacy-group.ts"
export * from "./pluralbuddy/field.ts";
export * from "./pluralbuddy/user";
export * from "./pluralbuddy/util";
export * from "./pluralbuddy/import-staging";
export * from "./pluralbuddy/import-notation";
export * from "./pluralbuddy/express-application";

export * from "./supportbuddy/blacklist-note";
