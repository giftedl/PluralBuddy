import type { PSystem } from "plurography";

export const getSpecificAutoProxy = (system: PSystem, label: string) =>
  system.systemAutoproxy.find((c) => c.serverId === label) ?? null;

export const getWiderAutoProxy = (
  system: PSystem,
  serverId?: string | undefined,
  channelId?: string | undefined,
) => {
  const channelLevel =
    serverId && channelId ? getSpecificAutoProxy(system, `${serverId}/${channelId}`) : null;
  const serverLevel = serverId ? getSpecificAutoProxy(system, serverId) : null;
  const globalLevel = getSpecificAutoProxy(system, "@global");

  return (
    channelLevel ??
    serverLevel ??
    globalLevel ?? {
      autoproxyMode: "off",
      autoproxyAlter: undefined,
      lastLatchTimestamp: undefined,
      serverId: "@global",
    }
  );
};

export const getCorrectLabel = (
  input: "global" | "server" | "channels",
  serverId: string,
  channelId: string,
) => {
  if (input === "global") return "@global";
  if (input === "server") return serverId;
  if (input === "channels") return `${serverId}/${channelId}`;
};
