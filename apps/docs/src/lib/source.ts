import {
  type RemarkFeedbackBlockOptions,
  remarkFeedbackBlock,
} from "fumadocs-core/mdx-plugins/remark-feedback-block";
import { loader } from "fumadocs-core/source";
import { pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import { defineDocs } from "fumadocs-mdx/macro";
import { openapiPlugin } from "fumadocs-openapi/server";
import { icons } from "lucide-react";

import { createElement } from "react";
import { z } from "zod";

export const docsImageRoute = "/og/docs";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      ["_discord-embed-name"]: z.string().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
    remarkPlugins: [[remarkFeedbackBlock]],
  },
});

export const source = loader({
  // optional: adds a badge to each page item in page tree
  plugins: [openapiPlugin()],
  source: docs.toFumadocsSource(),
  baseUrl: "/docs",

  icon(icon) {
    if (!icon) {
      // You may set a default icon
      return;
    }
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});

export function getPageImageUrl(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: "/" + [page.locale, ...docsImageRoute.split("/"), ...segments].filter(Boolean).join("/"),
  };
}
