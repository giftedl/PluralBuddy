import { generateFiles } from "fumadocs-openapi";
import { openapi } from "@/lib/openapi";
import { globby } from "globby";
import { mkdir } from "node:fs/promises";
import Bun from "bun";

await mkdir("content/docs/pluralbuddy/api");

await generateFiles({
  input: openapi,
  output: "./content/docs/pluralbuddy/api",
  includeDescription: true,
});

Bun.write(
  "./content/docs/pluralbuddy/api/meta.json",
  JSON.stringify(
    {
      title: "API References",
      pages: [
        "auth",
        ...(await globby(["./content/docs/pluralbuddy/api/**/*.mdx"]))
          .map((v) => v.replace("./content/docs/pluralbuddy/api/", "").replace(".mdx", ""))
          .filter((v) => !v.startsWith("auth/")),
      ],
      icon: "Notebook",
    },
    null,
    2,
  ),
);

Bun.write(
  "./content/docs/pluralbuddy/api/auth/meta.json",
  JSON.stringify(
    {
      title: "Authentication",
      pages: [
        ...(await globby(["./content/docs/pluralbuddy/api/**/*.mdx"]))
          .map((v) => v.replace("./content/docs/pluralbuddy/api/", "").replace(".mdx", ""))
          .filter((v) => v.startsWith("auth/"))
          .map((v) => v.replace("auth/", "")),
      ],
      icon: "Key",
    },
    null,
    2,
  ),
);
