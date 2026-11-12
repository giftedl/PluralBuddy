import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import { Spinner } from "@/components/ui/spinner";
import { Discord } from "@/components/ui/svgs/discord";
import { useTRPCClient } from "@/server/client";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function ProfileCard({
  data,
}: {
  data: {
    username: string | undefined;
    systemName: string;
    systemPronouns: string | null | undefined;
  };
}) {
  const trpcClient = useTRPCClient();

  const [systemName, setSystemName] = useState(data.systemName);
  const [systemPronouns, setSystemPronouns] = useState(data.systemPronouns);
  const [loading, setLoading] = useState(false);

  const editProfile = useMutation({
    mutationFn: async () =>
      trpcClient.account.updateAccountSettings.mutate({
        systemName,
        systemPronouns: systemPronouns === "" ? null : systemPronouns,
      }),
  });

  const onSubmit = async () => {
    setLoading(true);
    await editProfile.mutateAsync();
    setLoading(false);
  };

  return (
    <Card>
      <CardContent>
        <FieldSet>
          <FieldLegend>Account</FieldLegend>
          <FieldDescription>Fill in data about your account.</FieldDescription>
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <FieldDescription className="flex items-center gap-1">
                  Your username is automatically filled in from your{" "}
                  <strong className="flex items-center gap-1">
                    <Discord className="size-4" /> Discord
                  </strong>{" "}
                  profile.
                </FieldDescription>
              </FieldContent>
              <Input id="username" disabled value={data?.username ?? ""} />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">System Name</FieldLabel>
                <FieldDescription>Choose a name that well-represents your system.</FieldDescription>
              </FieldContent>
              <Input
                id="name"
                value={systemName}
                onChange={(evt) => setSystemName(evt.target.value)}
              />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="pronouns">System Pronouns</FieldLabel>
                <FieldDescription>express your inner identity 🎀</FieldDescription>
              </FieldContent>
              <Input
                id="pronouns"
                placeholder="she/her"
                value={systemPronouns ?? ""}
                onChange={(evt) => setSystemPronouns(evt.target.value)}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-muted-foreground">
          Not all options are configurable as they are linked to Discord.
        </span>
        <Button className="flex items-center gap-1" disabled={loading} onClick={onSubmit}>
          {loading && <Spinner />} Save
        </Button>
      </CardFooter>
    </Card>
  );
}
