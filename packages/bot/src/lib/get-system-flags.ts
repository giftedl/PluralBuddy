import { type PSystem, SystemFlags } from "plurography";

export function getSystemFeatures(data: PSystem) {
	return {
		keepProxyTags: ((data.flags ?? 0) & SystemFlags.KEEP_PROXY_TAGS) !== 0,
		includePronouns: ((data.flags ?? 0) & SystemFlags.INCLUDE_PRONOUNS) !== 0,
		noTypingStatus: ((data.flags ?? 0) & SystemFlags.NO_TYPING_STATUS) !== 0,
		preferAccessiblity: ((data.flags ?? 0) & SystemFlags.PREFER_ACCESSIBLITY) !== 0,
		leftSidedTag: ((data.flags ?? 0) & SystemFlags.LEFT_SIDED_TAG) !== 0,
		caseInsensitiveProxies: ((data.flags ?? 0) & SystemFlags.CASE_INSENSITIVE_PROXIES) !== 0,

		has: (flag: SystemFlags) => ((data.flags ?? 0) & flag) !== 0,
		disable: (flag: SystemFlags) =>
			(((data.flags) ?? 0) & flag) === 0 /* doesn't have flag */
				? (data.flags ?? 0)
				: (data.flags ?? 0) - flag,
		enable: (flag: SystemFlags) =>
			(((data.flags) ?? 0) & flag) !== 0 /* does have flag */
				? (data.flags ?? 0)
				: (data.flags ?? 0) + flag,
		bool: (flag: SystemFlags, bool?: boolean) =>
			bool
				? ((data.flags ?? 0) & flag) !== 0 /* does have flag */
					? (data.flags ?? 0)
					: (data.flags ?? 0) + flag
				: ((data.flags ?? 0) & flag) === 0 /* doesn't have flag */
					? (data.flags ?? 0)
					: (data.flags ?? 0) - flag,
	};
}
