// Thank you Heni for the code :WispSmug:

const SCOPE = {
  global: "global",
  globally: "global",
  server: "guild",
  guild: "guild",
  channel: "channels",
  channels: "channels",
} as const;
const OFF_SCOPE = {
  ...SCOPE,
  everywhere: "everywhere",
} as const;

type Scope = (typeof SCOPE)[keyof typeof SCOPE];
type OffScope = (typeof OFF_SCOPE)[keyof typeof OFF_SCOPE];

export function parseScope(args: string): Scope | undefined {
  const word = args.match(/-scope (\S+)$/)?.[1];
  return word && Object.hasOwn(SCOPE, word) ? SCOPE[word as keyof typeof SCOPE] : undefined;
}

export function parseOffScope(args: string): OffScope | undefined {
  const word = args.match(/-scope (\S+)$/)?.[1];
  return word && Object.hasOwn(OFF_SCOPE, word)
    ? OFF_SCOPE[word as keyof typeof OFF_SCOPE]
    : undefined;
}
