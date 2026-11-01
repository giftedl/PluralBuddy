/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import {
	defaultNudgingStructure,
	defaultUserStructure,
	PUserObject,
	type PUser,
} from "plurography";
import { userCollection } from "../mongodb";

export { defaultUserStructure, type PUser, PUserObject } from "plurography";

export const terminologyMemoryCache: Record<string, string> = {};

export async function getUserById(id: string): Promise<PUser> {
	const accountUser = await userCollection.findOne({ userId: id });
	const linkedSystemUser = accountUser?.system
		? null
		: await userCollection.findOne({ "system.verifiedSubAccounts": id });
	const systemUser = linkedSystemUser ?? accountUser;

	if (!systemUser) return defaultUserStructure(id);
	const normalizedSystemUser = {
		...defaultUserStructure(systemUser.userId),
		...systemUser,
	};
	if (!linkedSystemUser || linkedSystemUser.userId === id) {
		return {
			...normalizedSystemUser,
			nudging: {
				...defaultNudgingStructure(),
				...normalizedSystemUser.nudging,
			},
		};
	}

	const personalSettings: PUser = accountUser
		? { ...defaultUserStructure(id), ...accountUser }
		: defaultUserStructure(id);
	return {
		...normalizedSystemUser,
		userLang: personalSettings.userLang,
		blocked: personalSettings.blocked,
		policyStatus: personalSettings.policyStatus,
		nudging: {
			...defaultNudgingStructure(),
			...personalSettings.nudging,
		},
		terminology: personalSettings.terminology,
	};
}

export async function writeUserById(id: string, userObj: PUser) {
	return await userCollection.findOneAndReplace(
		{ userId: id },
		PUserObject.parse(userObj),
		{
			upsert: true,
		},
	);
}

export async function writePersonalSettingsById(id: string, userObj: PUser) {
	const defaults = defaultUserStructure(id);
	const personalSettings = {
		userLang: userObj.userLang ?? defaults.userLang,
		blocked: userObj.blocked ?? defaults.blocked,
		nudging: { ...defaultNudgingStructure(), ...userObj.nudging },
		terminology: userObj.terminology ?? defaults.terminology,
	};
	const set = {
		...personalSettings,
		...(userObj.policyStatus === undefined
			? {}
			: { policyStatus: userObj.policyStatus }),
	};

	return await userCollection.updateOne(
		{ userId: id },
		{ $set: set },
		{ upsert: true },
	);
}
