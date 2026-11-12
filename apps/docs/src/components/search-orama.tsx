"use client";

import { type OramaCloudOptions, useDocsSearch } from "fumadocs-core/search/client";
import { type ReactNode, useMemo, useState } from "react";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogListItem,
  SearchDialogOverlay,
  type SharedProps,
  TagsList,
  TagsListItem,
} from "@fumadocs/base-ui/components/dialog/search";
import type { SortedResult } from "fumadocs-core/search";
import type { SearchLink, TagItem } from "@fumadocs/base-ui/contexts/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { SearchItemType } from "@fumadocs/base-ui/components/dialog/search";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Item, Node } from "fumadocs-core/page-tree";
import { useTreeContext } from "@fumadocs/base-ui/contexts/tree";

export interface OramaSearchDialogProps extends SharedProps {
  links?: SearchLink[];
  footer?: ReactNode;

  defaultTag?: string;
  tags?: TagItem[];

  /**
   * Add the "Powered by Orama" label
   *
   * @defaultValue true
   */
  showOrama?: boolean;

  /**
   * Allow to clear tag filters
   *
   * @defaultValue false
   */
  allowClear?: boolean;
}

/**
 * Orama Cloud integration
 */
export default function OramaSearchDialog({
  tags = [
    { name: "PluralBuddy", value: "pluralbuddy" },
    { name: "Policies", value: "policies" },
  ],
  defaultTag,
  showOrama = true,
  allowClear = false,
  footer,
  links = [],
  ...props
}: OramaSearchDialogProps) {
  const { locale } = useI18n();
  const [tag, setTag] = useState(defaultTag);
  const router = useRouter();
  const { full } = useTreeContext();
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    locale,
    tag,
  });

  const defaultItems = useMemo<SortedResult[] | null>(() => {
    if (links.length === 0) return null;

    return links.map(([name, link]) => ({
      type: "page",
      id: name,
      content: name,
      url: link,
    }));
  }, [links]);
  const searchMap = useMemo(() => {
    const map = new Map<string, Item>();

    function onNode(node: Node) {
      if (node.type === "page" && typeof node.name === "string") {
        map.set(node.name.toLowerCase(), node);
      } else if (node.type === "folder") {
        if (node.index) onNode(node.index);
        for (const item of node.children) onNode(item);
      }
    }

    for (const item of full.children) onNode(item);
    return map;
  }, [full]);

  const pageTreeAction = useMemo<SearchItemType | undefined>(() => {
    if (search.length === 0) return;

    const normalized = search.toLowerCase();
    for (const [k, page] of searchMap) {
      if (!k.startsWith(normalized)) continue;

      return {
        id: "quick-action",
        type: "action",
        node: (
          <div className="inline-flex items-center gap-2 text-fd-muted-foreground">
            <ArrowRight className="size-4" />
            <p>
              Jump to <span className="font-medium text-fd-foreground">{page.name}</span>
            </p>
          </div>
        ),
        onSelect: () => router.push(page.url),
      };
    }
  }, [router, search, searchMap]);

  useOnChange(defaultTag, (v) => {
    setTag(v);
  });

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={
            query.data !== "empty" || pageTreeAction
              ? [
                  ...(pageTreeAction ? [pageTreeAction] : []),
                  ...(Array.isArray(query.data) ? query.data : []),
                ]
              : null
          }
        />
        <SearchDialogFooter>
          <TagsList tag={tag} onTagChange={setTag} allowClear={allowClear}>
            <TagsListItem key="PluralBuddy" value="pluralbuddy">
              PluralBuddy
            </TagsListItem>
            <TagsListItem key="Policies" value="policies">
              Policies
            </TagsListItem>
          </TagsList>
          {footer}
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
