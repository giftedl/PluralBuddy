import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useTRPCClient } from "@/server/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DestructiveCard({
  sessionData,
}: {
  sessionData: ReturnType<typeof authClient.useSession>;
}) {
  const trpc = useTRPCClient();
  const { isPending, data } = useQuery({
    queryKey: ["destructive"],
    queryFn: async () => trpc.account.destructiveStats.query(),
  });
  const [deletionPopupOpen, setDeletionPopupOpen] = useState(false);
  const [deletionInput, setDeletionInput] = useState("");
  const [stage, setStage] = useState(0);
  const router = useRouter();
  const deleteAccMutation = useMutation({
    mutationFn: async () => await trpc.account.deleteAccount.mutate(),
  });

  const deleteAcc = async () => {
    setStage(2);
    await deleteAccMutation.mutateAsync();
    setStage(0);
    router.push("/");
  };

  return (
    <Card>
      <Dialog onOpenChange={setDeletionPopupOpen} open={deletionPopupOpen}>
        <DialogContent className="min-w-150">
          {stage === 0 ? (
            <>
              <DialogTitle>Are you sure you'd like to delete your account?</DialogTitle>
              <DialogDescription>
                Deleting your account here will delete <strong>ALL</strong> data related to your
                user ID that is observable in the database. PluralBuddy Support is not able to
                reverse this action at all. <br /> <br /> It may take up to 7 days for all data from
                your account to be fully deleted. (backups & technical restrictions, as per{" "}
                <Link href="/docs/policies/privacy" className="text-primary">
                  PluralBuddy's Privacy Policy
                </Link>
                )
              </DialogDescription>
              <DialogFooter>
                <Field>
                  <FieldLabel htmlFor="confirmation">
                    Input "I confirm to delete @{sessionData.data?.user.name}" exactly to confirm
                  </FieldLabel>
                  <Input
                    id="confirmation"
                    placeholder={`I confirm to delete @${sessionData.data?.user.name}`}
                    value={deletionInput}
                    onChange={(evt) => setDeletionInput(evt.target.value)}
                    required
                  />
                  <Button
                    className="bg-red-500"
                    onClick={() => setStage(1)}
                    disabled={
                      deletionInput.toLocaleLowerCase() !==
                      `I confirm to delete @${sessionData.data?.user.name}`.toLocaleLowerCase()
                    }
                  >
                    I want to delete this account
                  </Button>
                </Field>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogTitle>This is not just your system!</DialogTitle>
              <DialogDescription className="w-full bg-red-500/60 p-4 rounded-xl text-foreground">
                🚫 🙅‍♀️{" "}
                <strong>
                  Deleting your account here will <i>not just</i> delete your system!
                </strong>
                <ul className="list-disc list-inside pl-3 pt-2">
                  <li>
                    {data?.alterCount} alter(s) will be <b>removed</b>.
                  </li>
                  <li>
                    {data?.tagCount} tag(s) will be <b>deleted</b>.
                  </li>
                  <li>
                    {data?.messageCount} message(s) will be <b>purged</b> in association to this
                    bot.
                  </li>
                  {data?.oauthClients !== 0 && (
                    <li>
                      {data?.oauthClients} OAuth client(s) will be <b>cleared</b>.
                    </li>
                  )}
                </ul>{" "}
                <br />
                Please confirm you'd like to do this.
              </DialogDescription>
              <DialogFooter>
                <Button className="w-full bg-red-500" onClick={deleteAcc} disabled={stage === 2}>
                  {stage === 2 && <Spinner />} Delete my account.
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <CardContent>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          This button will delete <strong>ALL</strong> data related to your user ID that is
          observable in the database. Not just your system, but additional data like sessions,
          developer data, etc.{" "}
          <strong>
            <u>You do not get a chance to export data with this button.</u>
          </strong>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-muted-foreground">
          This action is not reversible, so please continue with caution.
        </span>
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={() => setDeletionPopupOpen(true)}
        >
          Delete Account
        </Button>
      </CardFooter>
    </Card>
  );
}
