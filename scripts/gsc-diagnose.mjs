import fs from "node:fs";
import path from "node:path";

const tokensPath = path.join(process.cwd(), "data/gsc/oauth-tokens.json");
const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));
console.log("scope:", tokens.scope);

const res = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
  headers: { Authorization: `Bearer ${tokens.access_token}` },
});
const body = await res.text();
console.log("status:", res.status);
console.log(body.slice(0, 800));
