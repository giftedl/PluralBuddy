import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { SocialSettings } from "./page";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPCClient } from "@/server/client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/shadcn-button";
import { ArrowUpRight, Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { DiscordSnowflake } from "@sapphire/snowflake";

export function SocialNudgingCard({ data }: { data: SocialSettings }) {
  const trpc = useTRPCClient();
  const [nudgingEnabled, setNudgingEnabled] = useState(data.nudging.currentlyEnabled);
  const [blockedUsers, setBlockedUsers] = useState(data.nudging.blockedUsers ?? []);
  const [dmRepliesEnabled, setDmRepliesEnabled] = useState(data.nudging.dmReply);

  const [userInput, setUserInput] = useState("");
  const [inputError, setInputError] = useState("");

  const [loading, setLoading] = useState(false);
  const saveMutation = useMutation({
    mutationFn: async () =>
      trpc.social.updateNudgingSettings.mutate({
        nudgingEnabled,
        dmReplied: dmRepliesEnabled,
        blockedUsers,
      }),
  });

  const handleSaving = async () => {
    setLoading(true);
    await saveMutation.mutateAsync();
    setLoading(false);
  };

  return (
    <Card>
      <CardContent>
        <CardTitle>Nudging</CardTitle>
        <CardDescription>
          Nudging allows other users to ping or nudge you based on your alter.{" "}
        </CardDescription>

        <FieldGroup className="mt-3 gap-3">
          <FieldLabel htmlFor="nudging">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Nudging</FieldTitle>
                <FieldDescription>
                  Nudging allows other users to ping or nudge you based on your alter. You can
                  toggle this setting at any time. Disabling this setting does not take away your
                  ability to nudge others, it only disables the ability for others to nudge you.
                </FieldDescription>
              </FieldContent>
              <Switch id="nudging" onCheckedChange={setNudgingEnabled} checked={nudgingEnabled} />
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="dm-replies">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>DM Replies</FieldTitle>
                <FieldDescription>
                  DM replies will send you a DM when somebody replies to you. You must have DM's
                  enabled in atleast one of your servers I'm in or else I will not be able to reach
                  you.
                </FieldDescription>
              </FieldContent>
              <Switch
                id="dm-replies"
                onCheckedChange={setDmRepliesEnabled}
                checked={dmRepliesEnabled}
              />
            </Field>
          </FieldLabel>
        </FieldGroup>
        <div className="w-full  border rounded-lg mt-2">
          <div className="px-1.5 pt-1.5">
            <div className="p-2 xl:flex items-start justify-between">
              <div className="max-xl:pb-2">
                <CardTitle>Blocked Users</CardTitle>
                <CardDescription>
                  Block users that are problematically using the nudge feature.
                </CardDescription>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button>
                    <Plus />
                    <div className="xl:hidden">Block User</div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <CardTitle>Add User</CardTitle>
                  <CardDescription>
                    Add a Discord user ID to the nudge blocklist. Not sure how to get a user ID –{" "}
                    <Link href="https://dis.gd/findmyid" className="text-primary" target="_blank">
                      enable Developer Mode
                    </Link>
                    .
                  </CardDescription>

                  <Input
                    placeholder="1252031635692720224"
                    value={userInput}
                    onChange={(evt) => setUserInput(evt.target.value)}
                    aria-invalid={inputError !== ""}
                  />
                  {inputError && <FieldError>{inputError}</FieldError>}
                  <Button
                    onClick={() => {
                      setInputError("");
                      if (blockedUsers.includes(userInput)) {
                        setInputError("Already blocked.");
                        return;
                      }
                      if (Number.isNaN(Number(userInput))) {
                        setInputError("Not a valid user ID.");
                        return;
                      }
                      if (DiscordSnowflake.deconstruct(userInput).workerId === BigInt(0)) {
                        setInputError("Not a valid user ID.");
                        return;
                      }
                      setBlockedUsers((input) => [...input, userInput]);
                    }}
                    type="submit"
                  >
                    Submit
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
            <Separator />
          </div>
          <div className="h-72 scroll-fade scrollbar-none overflow-y-auto">
            <div className="flex flex-col gap-1.5 p-1.5">
              {blockedUsers.map((user) => (
                <BlockedUser
                  id={user}
                  key={user}
                  onDelete={() => setBlockedUsers(blockedUsers.filter((v) => v !== user))}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-1">
          Learn more about{" "}
          <Link
            href="/docs/pluralbuddy/user-concepts#nudging"
            target="_blank"
            className="text-primary flex items-center gap-1"
          >
            Nudging <ArrowUpRight className="size-4" />
          </Link>
        </span>
        <Button disabled={loading} onClick={handleSaving}>
          {loading && <Spinner />}Save
        </Button>
      </CardFooter>
    </Card>
  );
}

export function BlockedUser({ id, onDelete }: { id: string; onDelete: () => void }) {
  const trpc = useTRPCClient();
  const { data } = useQuery({
    queryKey: [`user/${id}`],
    queryFn: async () => trpc.social.getUser.query({ userId: id }),
  });

  return (
    <div
      key={id}
      className="rounded-lg bg-muted px-3 py-2.5 text-sm flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={data?.avatar ? `https://cdn.discordapp.com/avatars/${id}/${data.avatar}.png` : ""}
            alt={`@${data?.username}`}
          />
          <AvatarFallback>{(data?.username ?? id).toLocaleUpperCase()[0]}</AvatarFallback>
        </Avatar>
        {data?.username ? `@${data.username}` : id}
      </div>
      <Button variant="outline" onClick={onDelete}>
        <X />
      </Button>
    </div>
  );
}
