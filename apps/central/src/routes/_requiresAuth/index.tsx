import { createFileRoute } from "@tanstack/react-router";
import { Astroid } from "lucide-react";
import { Material } from "#/components/ui/material";
import { useAuth } from "#/hooks/use-auth";
import Markdown from "react-markdown";
import { useSystem } from "#/hooks/use-system";
import { Separator } from "#/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";
import { Skeleton } from "#/components/ui/skeleton";
import { SystemSkeleton } from "#/components/systems/system-skeleton";
import { cn } from "cn";
import { visit } from "unist-util-visit";
import type { Html, Nodes } from "mdast";

const discordEmojiConverter = function () {
  const emojiRegex = /<a?:(\w+):(\d+)>/g;

  return function (tree: Nodes) {

    visit(tree, "text", (node, _, parent) => {
      if (!parent) return;

      const stringSeparated = node.value.split(" ");
      const emojiSeparated  = stringSeparated.map(v => {
        const execution = emojiRegex.exec(v);
        return execution !== null ? { urlEmoji: `https://cdn.discordapp.com/emojis/${execution[1]}/${execution[2]}.png` } : v
      })

      parent.children = emojiSeparated.map(v => typeof v === "string" ? 
        ({position: { end: { line: node.position?.end.line,  }}, type: "text", value: v}) :
        ({}))
    });

  };
};

export const Route = createFileRoute("/_requiresAuth/")({ component: App });

function App() {
  const { profile } = useAuth();
  const system = useSystem();

  return (
    <main className="relative h-screen w-full">
      <motion.div
        className="mb-6 pt-6 sm:px-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 100, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0,
          ease: (t) => (t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t)),
        }}
      >
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {profile?.name}!</h1>
      </motion.div>
      <Material rounding="none" className="flex flex-col gap-2 pb-4" padding="none">
        <AnimatePresence>
          {system && (
            <motion.div
              className={cn(
                "w-full overflow-hidden rounded-b-lg bg-[linear-gradient(pink,white)] p-2 dark:bg-[linear-gradient(pink,var(--color-zinc-900))]",
                typeof system.systemBanner !== "string" &&
                  "animate-pulse rounded-b-lg bg-primary/10",
              )}

              initial={{ opacity: 0 }}
              animate={{ opacity: 100 }}
              transition={{
                duration: 0.8,
                delay: 0.05,
                ease: (t) => (t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t)),
              }}
            >
              <img
                src={system.systemBanner ?? "about:blank"}
                style={{
                  maskImage: "linear-gradient(white, rgba(0,0,0,0.4))",
                }}
                className="mx-auto max-h-[250px] rounded-xl"
              />
            </motion.div>
          )}

          {system ? (
            <motion.div
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 100 }}
              transition={{
                duration: 0.8,
                delay: 0.05,
                ease: (t) => (t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t)),
              }}
            >
              <div className="flex gap-6 p-6 max-lg:flex-col lg:justify-between">
                <div className="flex items-start gap-4">
                  {system.systemAvatar ? (
                    <img src={system.systemAvatar} className="size-20 rounded-full" />
                  ) : (
                    <div className="size-20 rounded-full border bg-primary/30"></div>
                  )}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      <h2 className="text-xl font-medium">{system?.systemName}</h2>
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Astroid className="size-4" />
                        {system?.systemPronouns}
                      </span>
                    </div>
                    <p className="h-full max-h-[150px]">
                      <Markdown rehypePlugins={[discordEmojiConverter]}>
                        {system?.systemDescription?.replaceAll("\n", "\n\n")}
                      </Markdown>
                    </p>
                  </div>
                </div>
                <Material elevation="high" className="flex flex-col gap-2">
                  <span className="text-sm font-bold">System details</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex min-w-65 justify-between">
                      <span className="text-muted-foreground">Created at</span>
                      <span>{new Date(system?.createdAt).toDateString()}</span>
                    </div>
                    <Separator />
                    <div className="flex min-w-65 justify-between">
                      <span className="text-muted-foreground">Alter count</span>
                      <span>{system?.alterIds.length}</span>
                    </div>
                    <Separator />
                    <div className="flex min-w-65 justify-between">
                      <span className="text-muted-foreground">Tag count</span>
                      <span>{system?.tagIds.length}</span>
                    </div>
                    <Separator />
                    <div className="flex min-w-65 items-center justify-between">
                      <span className="text-muted-foreground">Associated to</span>
                      <span className="font-mono text-xs">{system.associatedUserId}</span>
                    </div>
                  </div>
                </Material>
              </div>
            </motion.div>
          ) : (
            <SystemSkeleton />
          )}
        </AnimatePresence>
      </Material>
    </main>
  );
}
