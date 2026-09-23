"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { generateID } from "@/lib/form-helper";

interface FileInputProps {
	accept?: string;
	id?: string;
	multiple?: boolean;
	preview?: boolean;
	label?: string;
	className?: string;
}

export const FileInput = ({
	accept = "*",
	id = generateID(),
	multiple = false,
	preview = true,
	label,
	className = "",
}: FileInputProps) => {
	const [files, setFiles] = useState<FileList | null>(null);
	const [previewURLs, setPreviewURLs] = useState<string[] | undefined>();

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newFiles = e.target.files;
			setFiles(newFiles);
			if (preview && newFiles) {
				setPreviewURLs(Array.from(newFiles).map(URL.createObjectURL));
			}
		},
		[preview],
	);

	return (
		<div className={`flex flex-col gap-1 ${className}`}>
			{label && <Label htmlFor={id}>{label}</Label>}
			<label className="w-max relative cursor-pointer space-x-2 flex flex-row items-center">
				<Button>Browse</Button>
				{previewURLs && (
					<div className="flex flex-row items-center -space-x-1 hover:space-x-1 z-20 h-8">
						{previewURLs.map((file, index) => (
							<img
								key={index}
								src={file}
								onLoad={() => URL.revokeObjectURL(file)}
								alt={`preview-${index}`}
								className="w-8 h-8 object-cover rounded-full hover:w-16 hover:h-16 transition-all border border-slate-200 ring-1 ring-slate-50 dark:ring-zinc-950 bg-white dark:bg-zinc-950"
							/>
						))}
					</div>
				)}
				<span className="flex flex-row items-center text-slate-600 dark:text-zinc-400">
					{(files?.length ?? 0) === 0
						? "No file selected."
						: `${files?.length} file${files?.length !== 1 ? "s" : ""} selected`}
				</span>
				<input
					type="file"
					id={id}
					onChange={handleFileChange}
					accept={accept}
					multiple={multiple}
					className="w-full h-full inset-0 opacity-0 absolute cursor-pointer"
				/>
			</label>
		</div>
	);
};
