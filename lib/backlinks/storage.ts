import fs from "node:fs";
import path from "node:path";
import { DIRECTORY_CHECKLIST } from "./directories";
import type {
  BacklinkStore,
  BacklinkSubmission,
  SubmissionStatus,
} from "./types";

const BACKLINKS_DIR = path.join(process.cwd(), "data/backlinks");
const STORE_PATH = path.join(BACKLINKS_DIR, "submissions.json");

function ensureDir() {
  if (!fs.existsSync(BACKLINKS_DIR)) {
    fs.mkdirSync(BACKLINKS_DIR, { recursive: true });
  }
}

function slugId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url.trim());
    return `${parsed.origin}${parsed.pathname}`.replace(/\/$/, "");
  } catch {
    return url.trim().toLowerCase();
  }
}

function seedFromChecklist(): BacklinkSubmission[] {
  return DIRECTORY_CHECKLIST.map((item) => ({
    id: slugId(item.websiteName),
    websiteName: item.websiteName,
    url: item.url,
    category: item.category,
    submittedDate: null,
    status: "pending" as SubmissionStatus,
    backlinkUrl: null,
  }));
}

function mergeChecklist(submissions: BacklinkSubmission[]): BacklinkSubmission[] {
  const byUrl = new Map(
    submissions.map((s) => [normalizeUrl(s.url), s]),
  );
  let changed = false;

  for (const item of DIRECTORY_CHECKLIST) {
    const key = normalizeUrl(item.url);
    if (!byUrl.has(key)) {
      const entry: BacklinkSubmission = {
        id: slugId(item.websiteName),
        websiteName: item.websiteName,
        url: item.url,
        category: item.category,
        submittedDate: null,
        status: "pending",
        backlinkUrl: null,
      };
      submissions.push(entry);
      byUrl.set(key, entry);
      changed = true;
    }
  }

  return changed ? submissions : submissions;
}

function readRawStore(): BacklinkStore | null {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    return JSON.parse(raw) as BacklinkStore;
  } catch {
    return null;
  }
}

export function readBacklinkStore(): BacklinkStore {
  ensureDir();
  const existing = readRawStore();

  if (!existing?.submissions?.length) {
    const store: BacklinkStore = {
      version: 1,
      updatedAt: new Date().toISOString(),
      submissions: seedFromChecklist(),
    };
    writeBacklinkStore(store);
    return store;
  }

  const merged = mergeChecklist([...existing.submissions]);
  if (merged.length !== existing.submissions.length) {
    const store: BacklinkStore = {
      ...existing,
      updatedAt: new Date().toISOString(),
      submissions: merged,
    };
    writeBacklinkStore(store);
    return store;
  }

  return existing;
}

export function writeBacklinkStore(store: BacklinkStore): void {
  ensureDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export function getSubmissionById(id: string): BacklinkSubmission | null {
  const store = readBacklinkStore();
  return store.submissions.find((s) => s.id === id) ?? null;
}

export function upsertSubmission(
  input: Omit<BacklinkSubmission, "id"> & { id?: string },
): BacklinkSubmission {
  const store = readBacklinkStore();
  const id = input.id ?? slugId(input.websiteName);

  const entry: BacklinkSubmission = {
    id,
    websiteName: input.websiteName.trim(),
    url: input.url.trim(),
    category: input.category.trim(),
    submittedDate: input.submittedDate,
    status: input.status,
    backlinkUrl: input.backlinkUrl?.trim() || null,
    notes: input.notes?.trim() || undefined,
  };

  const index = store.submissions.findIndex((s) => s.id === id);
  if (index === -1) {
    store.submissions.push(entry);
  } else {
    store.submissions[index] = entry;
  }

  store.updatedAt = new Date().toISOString();
  writeBacklinkStore(store);
  return entry;
}

export function deleteSubmission(id: string): boolean {
  const store = readBacklinkStore();
  const before = store.submissions.length;
  store.submissions = store.submissions.filter((s) => s.id !== id);
  if (store.submissions.length === before) return false;
  store.updatedAt = new Date().toISOString();
  writeBacklinkStore(store);
  return true;
}

export function importBacklinkStore(
  payload: BacklinkStore,
  mode: "replace" | "merge" = "replace",
): BacklinkStore {
  if (payload.version !== 1 || !Array.isArray(payload.submissions)) {
    throw new Error("Invalid backlink store format");
  }

  const validStatuses: SubmissionStatus[] = [
    "submitted",
    "pending",
    "approved",
    "rejected",
  ];

  const sanitized = payload.submissions.map((s) => {
    if (!s.websiteName?.trim() || !s.url?.trim()) {
      throw new Error(`Invalid submission: ${s.id ?? "unknown"}`);
    }
    if (!validStatuses.includes(s.status)) {
      throw new Error(`Invalid status for ${s.websiteName}`);
    }
    return {
      id: s.id?.trim() || slugId(s.websiteName),
      websiteName: s.websiteName.trim(),
      url: s.url.trim(),
      category: (s.category ?? "Other").trim(),
      submittedDate: s.submittedDate ?? null,
      status: s.status,
      backlinkUrl: s.backlinkUrl?.trim() || null,
      notes: s.notes?.trim() || undefined,
    } satisfies BacklinkSubmission;
  });

  if (mode === "merge") {
    const current = readBacklinkStore();
    const byId = new Map(current.submissions.map((s) => [s.id, s]));
    for (const item of sanitized) {
      byId.set(item.id, item);
    }
    const store: BacklinkStore = {
      version: 1,
      updatedAt: new Date().toISOString(),
      submissions: Array.from(byId.values()),
    };
    writeBacklinkStore(store);
    return store;
  }

  writeBacklinkStore({
    version: 1,
    updatedAt: new Date().toISOString(),
    submissions: sanitized,
  });
  return readBacklinkStore();
}

export function exportBacklinkStore(): BacklinkStore {
  return readBacklinkStore();
}
