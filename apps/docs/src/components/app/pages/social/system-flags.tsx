// A portion of this file was taken from https://github.com/giftedl/PluralBuddy/blob/dash/apps/docs/src/components/app/pages/systems/privacy-system-card.tsx

import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/shadcn-button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPCClient } from "@/server/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const flags = [
  {
    name: "Name",
    value: 1 << 0,
    desc: "Allows other users to see your system name.",
  },
  {
    name: "Display Tag",
    value: 1 << 1,
    desc: "Allows other users to see your system display tag.",
  },
  {
    name: "Description",
    value: 1 << 2,
    desc: "Allows other users to see your system description.",
  },
  {
    name: "Avatar",
    value: 1 << 3,
    desc: "Allows other users to see your system avatar.",
  },
  {
    name: "Banner",
    value: 1 << 4,
    desc: "Allows other users to see your system banner.",
  },
  {
    name: "Pronouns",
    value: 1 << 5,
    desc: "Allows other users to see your system pronouns.",
  },
  {
    name: "Alters",
    value: 1 << 6,
    desc: "Allows other users to see your system alters.",
  },
  {
    name: "Tags",
    value: 1 << 7,
    desc: "Allows other users to see your system tags.",
  },
];

export function SystemFlags({ publicNum }: { publicNum: number }) {
  const trpc = useTRPCClient();
  const [values, setValues] = useState<{ name: string; value: string }[]>(
    flags.map((v) => ({
      name: v.name,
      value: publicNum & v.value ? "public" : "private",
    })),
  );
  const [loading, setLoading] = useState(false);
  const saveMutation = useMutation({
    mutationFn: async ({ flagNum }: { flagNum: number }) =>
      trpc.social.updateSystemPrivacy.mutate(flagNum),
  });

  const handleSaving = async () => {
    setLoading(true);

    let num = 0;
    for (const flag of flags) {
      num |= values.find((c) => c.name === flag.name)?.value === "public" ? flag.value : 0;
    }

    await saveMutation.mutateAsync({ flagNum: num });
    setLoading(false);
  };

  return (
    <Card>
      <CardContent>
        <CardTitle>System Privacy Flags</CardTitle>
        <CardDescription>
          Some data on your system can be configured to only be visible to yourself or to be
          visibile to others aswell.
        </CardDescription>
        <div className="grid grid-cols-2 gap-6 mt-4">
          {flags.map((flag, i) => (
            <Field className="flex! justify-between flex-row! items-center" key={flag.name}>
              <div className="block">
                <FieldLabel>{flag.name}</FieldLabel>
                <FieldDescription>{flag.desc}</FieldDescription>
              </div>
              <Select
                value={values.find((c) => c.name === flag.name)?.value}
                onValueChange={(v) =>
                  setValues((i) => [
                    ...i.filter((c) => c.name !== flag.name),
                    { name: flag.name, value: v },
                  ])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Public or private?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-1">
          Learn more about{" "}
          <Link
            href="/docs/pluralbuddy/user-concepts#system-privacy"
            target="_blank"
            className="text-primary flex items-center gap-1"
          >
            System Privacy <ArrowUpRight className="size-4" />
          </Link>
        </span>
        <Button disabled={loading} onClick={handleSaving}>
          {loading && <Spinner />}Save
        </Button>
      </CardFooter>
    </Card>
  );
}
