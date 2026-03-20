"use client";

import {
	type OramaCloudOptions,
	useDocsSearch,
} from "fumadocs-core/search/client";
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
} from "fumadocs-ui/components/dialog/search";
import type { SortedResult } from "fumadocs-core/search";
import type { SearchLink, TagItem } from "fumadocs-ui/contexts/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";

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

	useOnChange(defaultTag, (v) => {
		setTag(v);
	});

	const label = showOrama && <Label />;

	return (
		<SearchDialog
			search={search}
			onSearchChange={setSearch}
			isLoading={query.isLoading}
			{...props}
		>
			<SearchDialogOverlay />
			<SearchDialogContent>
				<SearchDialogHeader>
					<SearchDialogIcon />
					<SearchDialogInput />
					<SearchDialogClose />
				</SearchDialogHeader>
				<SearchDialogList
					items={query.data !== "empty" ? query.data : null}
					Item={(props) => (
						<SearchDialogListItem
							{...props}
							renderHighlights={(text) => {
								return <>cheeseburger</>
							}}
						/>
					)}
				/>
				<SearchDialogFooter>
					{tags.length > 0 ? (
						<TagsList tag={tag} onTagChange={setTag} allowClear={allowClear}>
							<TagsListItem key="PluralBuddy" value="pluralbuddy">
								PluralBuddy
							</TagsListItem>
							<TagsListItem key="Policies" value="policies">
								Policies
							</TagsListItem>
							{label}
						</TagsList>
					) : (
						label
					)}
					{footer}
				</SearchDialogFooter>
			</SearchDialogContent>
		</SearchDialog>
	);
}

function Label() {
	return (
		<a
			href="https://orama.com"
			rel="noreferrer noopener"
			className="ms-auto text-xs text-fd-muted-foreground"
		>
			Search powered by Orama
		</a>
	);
}
