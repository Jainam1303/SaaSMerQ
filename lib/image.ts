"use client";

/** Human-readable byte size. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export interface LoadedImage {
  image: HTMLImageElement;
  width: number;
  height: number;
  /** Revoke the object URL when finished to free memory. */
  cleanup: () => void;
}

/**
 * Loads a File into an HTMLImageElement using an object URL. The caller must
 * invoke cleanup() to release the URL — this keeps processing fully in-memory
 * and ensures temporary references are released promptly.
 */
export function loadImageFromFile(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({
        image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        cleanup: () => URL.revokeObjectURL(url),
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The image could not be decoded."));
    };
    image.src = url;
  });
}

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export const FORMAT_EXTENSION: Record<OutputFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Renders an image to a canvas at the given dimensions and exports a Blob.
 * Returns null if the browser cannot encode the requested format.
 */
export function renderToBlob(
  image: HTMLImageElement,
  width: number,
  height: number,
  format: OutputFormat,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(null);
      return;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    // White matte for formats without alpha to avoid black backgrounds.
    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => resolve(blob), format, quality);
  });
}
