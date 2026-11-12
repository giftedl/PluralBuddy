"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import z from "zod";
import { useTRPCClient } from "@/server/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Button } from "../ui/shadcn-button";

const parkedIds = [
  "status",
  "alter",
  "clear-latch",
  "a",
  "cl",
  "l",
  "lch",
  "latch",
  "off",
  "shutup",
] as const;

const formSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(40)
    .refine((id) => !parkedIds.includes(id as (typeof parkedIds)[0]), {
      message: "ID cannot be a native auto-proxy command.",
    })
    .refine((id) => !id.includes(" "), {
      message: "Cannot contain spaces.",
    }),
});

export function AIAPCard({
  integrationId,
  existingId,
}: {
  integrationId: string;
  existingId: string;
}) {
  const trpcClient = useTRPCClient();
  const submitMutation = useMutation({
    mutationFn: async (id: string) =>
      trpcClient.developers.updateAIAPID.mutate({
        newId: id,
        integrationId,
      }),
  });
  const form = useForm({
    validators: {
      onSubmit: formSchema,
    },
    defaultValues: {
      id: existingId,
    },
    onSubmit: async ({ value }) => {
      toast.promise(async () => submitMutation.mutateAsync(value.id), {
        success: "Successfully changed AI/AP ID",
        loading: "Loading...",
        error: "This ID was already taken, or something else went wrong.",
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="w-full"
    >
      <Card className="w-full pb-12">
        <CardHeader>
          <CardTitle>Automatic Integrational Auto-Proxy (AI/AP)</CardTitle>
          <CardDescription>
            Automatic Integrational Auto-Proxy, AI/AP, is an API endpoint which allows users to use
            your integration as a front tracker.
            <br />
            <br />
            <strong>Pick a unique ID identifying your application</strong> if you wish to use the
            AI/AP API. (1-40 characters long)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.Field
            name="id"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>AI/AP ID</FieldLabel>
                  <FieldDescription>
                    Pick a unique ID representing your application. Must be unique and 1-40
                    characters, and not a native auto-proxy mode's existing name.
                  </FieldDescription>
                  <InputGroup className="w-full">
                    <InputGroupAddon className="pl-4 text-muted-foreground">pb;ap </InputGroupAddon>
                    <InputGroupInput
                      maxLength={40}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      placeholder="my-front-tracker"
                      autoComplete="off"
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            Learn more about{" "}
            <Link
              href="/docs/pluralbuddy/ai-ap"
              target="_blank"
              className="text-primary flex items-center gap-1"
            >
              AI/AP <ArrowUpRight className="size-4" />
            </Link>
          </span>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
