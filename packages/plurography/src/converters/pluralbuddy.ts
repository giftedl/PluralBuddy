import z from "zod";
import { PAlter } from "../pluralbuddy/alter";
import { ImportNotation } from "../pluralbuddy/import-notation";
import { PSystem } from "../pluralbuddy/system";
import { PTag } from "../pluralbuddy/tag";
import Converter from ".";

export default class PluralBuddyConverter
    implements
        Converter<{
            system: PSystem;
            alter: PAlter;
            tag: PTag;
            import: z.infer<typeof ImportNotation>;
        }>
{
    to(system: PSystem) {
        return system
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