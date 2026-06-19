"use client";

import * as React from "react";
import { ImageUp } from "lucide-react";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  validateImageFile,
  verifyImageMagicBytes,
} from "@/lib/security";
import { cn } from "@/lib/utils";

export function ImageDropzone({
  onFile,
  onError,
}: {
  onFile: (file: File) => void;
  onError: (message: string) => void;
}) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function accept(file: File | undefined) {
    if (!file) return;
    const basic = validateImageFile(file);
    if (!basic.ok) {
      onError(basic.error ?? "Invalid file.");
      return;
    }
    const magic = await verifyImageMagicBytes(file);
    if (!magic.ok) {
      onError(magic.error ?? "Invalid file.");
      return;
    }
    onError("");
    onFile(file);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void accept(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-accent/30",
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ImageUp className="size-6" />
      </span>
      <p className="font-medium">Drop an image here or click to upload</p>
      <p className="text-xs text-muted-foreground">
        JPG, PNG or WebP · up to 10 MB · processed privately in your browser
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_EXTENSIONS.join(",")}
        className="sr-only"
        aria-label="Upload an image"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          void accept(file);
        }}
      />
    </div>
  );
}
