import z from "zod";
import { PAlter } from "../pluralbuddy/alter";
import { ImportNotation } from "../pluralbuddy/import-notation";
import { PSystem } from "../pluralbuddy/system";
import { PTag } from "../pluralbuddy/tag";
import Converter from ".";

<<<<<<< HEAD
export default class PluralBuddyConverter implements Converter<{
  system: PSystem;
  alter: PAlter;
  tag: PTag;
  import: z.infer<typeof ImportNotation>;
}> {
  to(system: PSystem) {
    return system;
  }
  toAlter(alter: PAlter) {
    return alter;
  }
  toImport(data: z.infer<typeof ImportNotation>) {
    return data;
  }
  toTag(tag: PTag) {
    return tag;
  }
  from(system: PSystem) {
    return system;
  }
  fromAlter(data: PAlter) {
    return data;
  }
  fromImport(data: z.infer<typeof ImportNotation>) {
    return data;
  }
  fromTag(data: PTag) {
    return data;
  }
}
=======
export default class PluralBuddyConverter
	implements
		Converter<{
			system: PSystem;
			alter: PAlter;
			tag: PTag;
			import: z.infer<typeof ImportNotation>;
		}>
{
	to(system: PSystem, forceUserId?: string) {
		return { ...system, systemId: forceUserId ?? "@me" };
	}
	toAlter(alter: PAlter, forceUserId?: string) {
		return { ...alter, systemId: forceUserId ?? "@me" };
	}
	toImport(data: z.infer<typeof ImportNotation>) {
		return data;
	}
	toTag(tag: PTag, forceUserId?: string) {
		return {...tag, systemId: forceUserId ?? "@me"};
	}
	from(system: PSystem) {
		return system;
	}
	fromAlter(data: PAlter) {
		return data;
	}
	fromImport(data: z.infer<typeof ImportNotation>) {
		return data;
	}
	fromTag(data: PTag) {
		return data;
	}
}
>>>>>>> 2bc1cfa15f9539ae844af4a92ea7b0715d42df63
