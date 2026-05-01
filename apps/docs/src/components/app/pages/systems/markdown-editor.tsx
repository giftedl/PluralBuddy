import { Plate, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import { BasicBlocksKit } from "@/components/editor/plugins/basic-blocks-kit";
import { BasicMarksKit } from "@/components/editor/plugins/basic-marks-kit";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import {
	Bold,
	Heading1,
	Heading2,
	Heading3,
	Italic,
	Quote,
	Underline,
} from "lucide-react";
import { ToolbarButton, ToolbarSeparator } from "@/components/ui/toolbar";
import { MarkdownPlugin } from "@platejs/markdown";
import { useEffect } from "react";
import { KEYS } from "platejs";
import { findAndReplace } from "mdast-util-find-and-replace";
import remarkGfm from "remark-gfm";

export function MarkdownEditor({
	description,
	setDescription,
	maxChars = 1000
}: {
	description: string;
	setDescription: (newValue: string) => void;
	maxChars?: number;
}) {
	const editor = usePlateEditor({
		plugins: [
			...BasicBlocksKit,
			...BasicMarksKit,
			MarkdownPlugin.configure({
				options: {
					remarkPlugins: [remarkGfm]
				}
			}),
		],
		value: (editor) =>
			editor.getApi(MarkdownPlugin).markdown.deserialize(description),
	}); // Initializes the editor instance

	return (
		<Plate
			editor={editor}
			onChange={() => {
				const markdownOutput = editor.api.markdown.serialize();
				setDescription(
					markdownOutput.replaceAll("​", "").replaceAll("\n\n", "\n").replaceAll("&#x20;\n", ""),
				);

				console.log({a: description})
			}}
		>
			{" "}
			{/* Provides editor context */}
			<EditorContainer className="max-h-75 max-w-137 w-full border rounded-lg">
				<FixedToolbar className="justify-start rounded-t-lg">
					<MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
						<Bold />
					</MarkToolbarButton>
					<MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
						<Italic />
					</MarkToolbarButton>
					<ToolbarSeparator />
					<ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>
						<Quote />
					</ToolbarButton>
					<ToolbarSeparator />
					<ToolbarButton onClick={() => editor.tf.h1.toggle()}>
						<Heading1 />
					</ToolbarButton>
					<ToolbarButton onClick={() => editor.tf.h2.toggle()}>
						<Heading2 />
					</ToolbarButton>
					<ToolbarButton onClick={() => editor.tf.h3.toggle()}>
						<Heading3 />
					</ToolbarButton>
					<ToolbarSeparator />
					<ToolbarButton className={description.length > 1000 ? "text-red-400" : ""}>
						{description.length}/{maxChars} characters used
					</ToolbarButton>
				</FixedToolbar>
				{/* Styles the editor area */}
				<Editor
					id="description"
					placeholder="Type your amazing system description here..."
				/>
			</EditorContainer>
		</Plate>
	);
}
