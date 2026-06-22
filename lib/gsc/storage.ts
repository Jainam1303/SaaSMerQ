import fs from "node:fs";
import path from "node:path";
import type { GscCacheFile, GscOAuthTokens } from "./types";

const GSC_DIR = path.join(process.cwd(), "data/gsc");
const TOKENS_PATH = path.join(GSC_DIR, "oauth-tokens.json");
const CACHE_PATH = path.join(GSC_DIR, "cache.json");

function ensureDir() {
  if (!fs.existsSync(GSC_DIR)) {
    fs.mkdirSync(GSC_DIR, { recursive: true });
  }
}

export function readOAuthTokens(): GscOAuthTokens | null {
  try {
    const raw = fs.readFileSync(TOKENS_PATH, "utf8");
    return JSON.parse(raw) as GscOAuthTokens;
  } catch {
    return null;
  }
}

export function writeOAuthTokens(tokens: GscOAuthTokens): void {
  ensureDir();
  fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2), "utf8");
}

export function clearOAuthTokens(): void {
  try {
    if (fs.existsSync(TOKENS_PATH)) fs.unlinkSync(TOKENS_PATH);
  } catch {
    /* ignore */
  }
}

export function readCache(): GscCacheFile | null {
  try {
    const raw = fs.readFileSync(CACHE_PATH, "utf8");
    return JSON.parse(raw) as GscCacheFile;
  } catch {
    return null;
  }
}

export function writeCache(cache: GscCacheFile): void {
  ensureDir();
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
}
