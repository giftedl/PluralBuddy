import { AlterFlags, type PAlter } from "plurography";

export function getAlterFeatures(data: PAlter) {
  return {
    keepProxyTags: ((data.flags ?? 0) & AlterFlags.PROXY_TAGS_KEPT) !== 0,

    has: (flag: AlterFlags) => ((data.flags ?? 0) & flag) !== 0,
    disable: (flag: AlterFlags) =>
      ((data.flags ?? 0) & flag) === 0 /* doesn't have flag */
        ? (data.flags ?? 0)
        : (data.flags ?? 0) - flag,
    enable: (flag: AlterFlags) =>
      ((data.flags ?? 0) & flag) !== 0 /* does have flag */
        ? (data.flags ?? 0)
        : (data.flags ?? 0) + flag,
    bool: (flag: AlterFlags, bool?: boolean) =>
      bool
        ? ((data.flags ?? 0) & flag) !== 0 /* does have flag */
          ? (data.flags ?? 0)
          : (data.flags ?? 0) + flag
        : ((data.flags ?? 0) & flag) === 0 /* doesn't have flag */
          ? (data.flags ?? 0)
          : (data.flags ?? 0) - flag,
  };
}
