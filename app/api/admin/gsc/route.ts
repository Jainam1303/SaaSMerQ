import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const DATA_PATH = path.join(process.cwd(), "data/gsc/dashboard.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Dashboard data not found" }, { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(DATA_PATH, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
