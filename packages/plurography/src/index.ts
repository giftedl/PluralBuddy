/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { PluralKitConfiguration, PluralKitSystem } from "./pluralkit";
import { PluralKitAPISystem } from "./pluralkit/api-system";
import { PluralKitGroup } from "./pluralkit/group";
import { PluralKitMember } from "./pluralkit/member";
import { SimplyPluralSystem } from "./simplyplural";
import { SimplyPluralMember } from "./simplyplural/alter";
import { SimplyPluralGroup } from "./simplyplural/group";
import { TupperBoxSystem } from "./tupperbox";
import { TupperBoxGroup } from "./tupperbox/group";
import { Tupper } from "./tupperbox/tupper";

export {
	PluralKitConfiguration,
	PluralKitGroup,
	PluralKitMember,
	PluralKitSystem,
	PluralKitAPISystem
};
export { Tupper, TupperBoxGroup, TupperBoxSystem };
export { SimplyPluralSystem, SimplyPluralMember, SimplyPluralGroup }

// TODO: figure out how to fix converters getting into Next.js build (who asked?)
export * from "./converters"
export * from "./pluralbuddy/alter";
export * from "./pluralbuddy/auto-proxy";
export * from "./pluralbuddy/express-application";
export * from "./pluralbuddy/front";
export * from "./pluralbuddy/guild";
export * from "./pluralbuddy/import-notation";
export * from "./pluralbuddy/import-staging";
export * from "./pluralbuddy/import-transcript"
export * from "./pluralbuddy/message";
export * from "./pluralbuddy/operation";
export * from "./pluralbuddy/system";
export * from "./pluralbuddy/tag";
export * from "./pluralbuddy/user";
export * from "./pluralbuddy/util";

export * from "./supportbuddy/blocked-note";
