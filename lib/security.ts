/**
 * Shared security helpers: input sanitization and client-side file validation.
 * These run in the browser for the (entirely client-side) tools, and the
 * constants are reused by middleware/headers for defence in depth.
 */

/** Allowed image upload MIME types. */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** Allowed image file extensions (lower-case, with dot). */
export const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
] as const;

/** Maximum upload size: 10 MB. */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export interface FileValidationResult {
  ok: boolean;
  error?: string;
}

/**
 * Validates an uploaded image by extension, MIME type and size. This is the
 * first line of defence; the browser additionally never sends the file
 * anywhere since processing is local.
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!file) return { ok: false, error: "No file selected." };

  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      error: `File is too large. Maximum size is ${Math.round(
        MAX_IMAGE_BYTES / (1024 * 1024),
      )} MB.`,
    };
  }

  if (file.size === 0) {
    return { ok: false, error: "File appears to be empty." };
  }

  const name = file.name.toLowerCase();
  const hasValidExt = ALLOWED_IMAGE_EXTENSIONS.some((ext) =>
    name.endsWith(ext),
  );
  if (!hasValidExt) {
    return {
      ok: false,
      error: "Unsupported file extension. Use JPG, PNG or WebP.",
    };
  }

  const type = file.type.toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return {
      ok: false,
      error: "Unsupported file type. Use JPG, PNG or WebP.",
    };
  }

  return { ok: true };
}

/**
 * Verifies a file's real content type by inspecting its magic-number header,
 * preventing a renamed executable from masquerading as an image.
 */
export async function verifyImageMagicBytes(
  file: File,
): Promise<FileValidationResult> {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isPng =
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47;
  const isWebp =
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50;

  if (isJpeg || isPng || isWebp) return { ok: true };

  return {
    ok: false,
    error: "File content does not match a valid JPG, PNG or WebP image.",
  };
}

/** Escapes HTML-significant characters to neutralise XSS in rendered text. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Removes control characters and trims a single-line input. */
export function sanitizeSingleLine(input: string, maxLength = 2048): string {
  return input
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .slice(0, maxLength)
    .trim();
}

/**
 * Validates and normalises a UPI Virtual Payment Address (e.g. name@bank).
 * Allows the limited character set permitted by NPCI for VPAs.
 */
export function isValidUpiId(value: string): boolean {
  return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(value.trim());
}

/**
 * Validates an http/https URL and blocks other schemes (javascript:, data:,
 * file:, etc.) to prevent injection and path-traversal style abuse.
 */
export function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
