"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { generateID } from "@/lib/form-helper";
import { Input } from "@/components/ui/input";
import { FilePlusIcon } from "lucide-react";

interface FileInputProps {
  accept?: string;
  files?: FileList | null;
  label?: string;
  id?: string;
  url?: string;
}

const ImageInput = ({
  accept = "image/*",
  files: initialFiles = null,
  label,
  id = generateID(),
  url,
}: FileInputProps) => {
  const [files, setFiles] = useState<FileList | null>(initialFiles);
  const [dragover, setDragover] = useState(false);
  const previewURL = files ? URL.createObjectURL(files[0]) : undefined;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFiles(e.dataTransfer?.files || null);
    setDragover(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
      setDragover(true);
    }
  };

  return (
    <div className="flex flex-col">
      {label && <Label htmlFor={id}>{label}</Label>}
      <label
        className={`flex flex-col items-center px-8 py-4 mx-auto w-full rounded-xl
          border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black
          cursor-pointer transition-colors
          ${dragover ? "border-sky-500 text-sky-500" : ""}
          ${url ? "rounded-b-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragover(false)}
      >
        {files ? (
          <img
            src={previewURL}
            onLoad={() => previewURL && URL.revokeObjectURL(previewURL)}
            className="w-full max-w-sm h-full rounded-lg"
            alt="Preview"
          />
        ) : (
          <>
            <FilePlusIcon className="opacity-50 w-9 h-9" />
            <p className="text-sm opacity-50">Attach a file</p>
          </>
        )}
        <input
          type="file"
          id={id}
          onChange={(e) => setFiles(e.target.files)}
          accept={accept}
          className="hidden"
        />
      </label>
      {url !== undefined && (
        <Input
          className="rounded-t-none border-t-0 rounded-xl"
          placeholder="https://example.com/img1.png"
        />
      )}
    </div>
  );
};

export { ImageInput };
