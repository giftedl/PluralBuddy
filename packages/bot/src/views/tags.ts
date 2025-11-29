/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { PTag } from "@/types/tag";
import { TranslatedView } from "./translated-view";
import { TextDisplay } from "seyfert";

export class TagView extends TranslatedView {
    tagProfileView(tag: PTag) {
		const innerComponents =
			new TextDisplay().setContent(`## ${tag.tagFriendlyName}
${tag.tagDescription !== null ? "\n" : ""}${tag.tagDescription ?? ""}${tag.tagDescription !== null ? "\n" : ""}
**Alter Count:** ${tag.associatedAlters.length}\n
-# ID: \`${tag.tagId}\``);
    }
}