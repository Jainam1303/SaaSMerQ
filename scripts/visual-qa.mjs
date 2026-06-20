/**
 * Visual QA audit — screenshots + automated layout checks.
 * Usage: node scripts/visual-qa.mjs [baseUrl]
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = process.argv[2] ?? "https://merqprime.in";
const OUT_DIR = path.join(process.cwd(), "qa-screenshots");

const CALCULATOR_SLUGS = [
  "emi-calculator",
  "sip-calculator",
  "percentage-calculator",
  "age-calculator",
  "unit-converter",
  "gst-calculator",
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

/** @type {{ severity: string; page: string; viewport: string; issue: string }[]} */
const defects = [];

function slugify(s) {
  return s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

async function checkOverflow(page, label, viewportName) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);
    const clientW = doc.clientWidth;
    const offenders = [];
    document.querySelectorAll("*").forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
        const rect = el.getBoundingClientRect();
        if (rect.width > clientW + 2) {
          const tag = el.tagName.toLowerCase();
          const cls = (el.className && typeof el.className === "string")
            ? el.className.slice(0, 60)
            : "";
          offenders.push(`${tag}.${cls} w=${Math.round(rect.width)}`);
        }
      }
    });
    return {
      horizontalScroll: scrollW > clientW + 1,
      scrollWidth: scrollW,
      clientWidth: clientW,
      offenders: offenders.slice(0, 5),
    };
  });

  if (overflow.horizontalScroll) {
    defects.push({
      severity: "high",
      page: label,
      viewport: viewportName,
      issue: `Horizontal overflow: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}. Offenders: ${overflow.offenders.join("; ") || "none identified"}`,
    });
  }
}

async function checkClippedText(page, label, viewportName) {
  const clipped = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll("h1,h2,h3,p,span,a,button,label").forEach((el) => {
      const style = getComputedStyle(el);
      if (style.overflow === "hidden" && el.scrollHeight > el.clientHeight + 4) {
        const text = (el.textContent || "").trim().slice(0, 40);
        if (text.length > 0) bad.push(`${el.tagName}: "${text}"`);
      }
    });
    return bad.slice(0, 5);
  });
  if (clipped.length) {
    defects.push({
      severity: "medium",
      page: label,
      viewport: viewportName,
      issue: `Possibly clipped text: ${clipped.join("; ")}`,
    });
  }
}

async function checkContrast(page, label, viewportName) {
  const lowContrast = await page.evaluate(() => {
    const fails = [];
    const check = (el) => {
      const style = getComputedStyle(el);
      const color = style.color;
      const bg = style.backgroundColor;
      if (!color || !bg || bg === "rgba(0, 0, 0, 0)") return;
      const parse = (c) => {
        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return null;
        return [+m[1], +m[2], +m[3]];
      };
      const fg = parse(color);
      const bk = parse(bg);
      if (!fg || !bk) return;
      const lum = ([r, g, b]) => {
        const [rs, gs, bs] = [r, g, b].map((v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };
      const l1 = lum(fg);
      const l2 = lum(bk);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const text = (el.textContent || "").trim().slice(0, 30);
      if (text && ratio < 4.5 && el.tagName !== "SVG") {
        fails.push(`${el.tagName} "${text}" ratio=${ratio.toFixed(2)}`);
      }
    };
    document.querySelectorAll("p,span,a,button,label,h1,h2,h3,li").forEach(check);
    return fails.slice(0, 5);
  });
  if (lowContrast.length) {
    defects.push({
      severity: "medium",
      page: label,
      viewport: viewportName,
      issue: `Low contrast (AA < 4.5): ${lowContrast.join("; ")}`,
    });
  }
}

async function testSearchBar(page) {
  const input = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]').first();
  const count = await input.count();
  if (count === 0) {
    defects.push({
      severity: "high",
      page: "homepage",
      viewport: "desktop",
      issue: "Search input not found on homepage",
    });
    return;
  }
  await input.fill("emi");
  await page.waitForTimeout(400);
  const results = page.locator('[role="listbox"] a, [data-search-results] a, ul li a').first();
  const hasResults = await results.count() > 0;
  const dropdownVisible = await page.locator('[role="listbox"], [data-search-results]').count() > 0;
  if (!hasResults && !dropdownVisible) {
    defects.push({
      severity: "medium",
      page: "homepage",
      viewport: "desktop",
      issue: "Search bar: no dropdown/results after typing 'emi'",
    });
  }
}

async function testStickyResultPanel(page, slug, viewportName) {
  if (viewportName !== "desktop") return;
  const sticky = page.locator(".lg\\:sticky, [class*='sticky']").first();
  if (await sticky.count() === 0) {
    defects.push({
      severity: "low",
      page: `/tools/${slug}`,
      viewport: "desktop",
      issue: "No sticky result panel element found",
    });
    return;
  }
  const before = await sticky.evaluate((el) => el.getBoundingClientRect().top);
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(300);
  const after = await sticky.evaluate((el) => el.getBoundingClientRect().top);
  // Sticky should stay near top (top-24 ~ 96px) not scroll away with page
  if (after > before + 50 && before > 200) {
    defects.push({
      severity: "medium",
      page: `/tools/${slug}`,
      viewport: "desktop",
      issue: `Sticky panel may not be working: top before=${before.toFixed(0)} after scroll=${after.toFixed(0)}`,
    });
  }
}

async function screenshot(page, name) {
  const file = path.join(OUT_DIR, name);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function auditPage(browser, urlPath, label, viewports) {
  for (const [vpName, size] of Object.entries(viewports)) {
    const context = await browser.newContext({
      viewport: size,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const url = `${BASE_URL}${urlPath}`;
    const res = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    if (!res || res.status() >= 400) {
      defects.push({
        severity: "high",
        page: urlPath,
        viewport: vpName,
        issue: `HTTP ${res?.status() ?? "failed"} loading ${url}`,
      });
      await context.close();
      continue;
    }
    await page.waitForTimeout(500);
    const shotName = `${slugify(label)}-${vpName}.png`;
    await screenshot(page, shotName);
    await checkOverflow(page, urlPath, vpName);
    await checkClippedText(page, urlPath, vpName);
    await checkContrast(page, urlPath, vpName);
    await context.close();
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Visual QA → ${BASE_URL}`);
  console.log(`Screenshots → ${OUT_DIR}`);

  const browser = await chromium.launch({ headless: true });

  // Homepage — all three viewports
  await auditPage(browser, "/", "homepage", VIEWPORTS);

  // Search bar (desktop homepage)
  const searchCtx = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const searchPage = await searchCtx.newPage();
  await searchPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle", timeout: 60000 });
  await testSearchBar(searchPage);
  await searchCtx.close();

  // Calculator pages
  for (const slug of CALCULATOR_SLUGS) {
    const calcViewports = { desktop: VIEWPORTS.desktop, mobile: VIEWPORTS.mobile };
    await auditPage(browser, `/tools/${slug}`, `calc-${slug}`, calcViewports);

    const stickyCtx = await browser.newContext({ viewport: VIEWPORTS.desktop });
    const stickyPage = await stickyCtx.newPage();
    await stickyPage.goto(`${BASE_URL}/tools/${slug}`, { waitUntil: "networkidle", timeout: 60000 });
    await testStickyResultPanel(stickyPage, slug, "desktop");
    await stickyCtx.close();
  }

  // Blog
  await auditPage(browser, "/blog", "blog-index", {
    desktop: VIEWPORTS.desktop,
    mobile: VIEWPORTS.mobile,
  });
  await auditPage(browser, "/blog/how-to-calculate-emi", "blog-article", {
    desktop: VIEWPORTS.desktop,
    mobile: VIEWPORTS.mobile,
  });

  await browser.close();

  const report = {
    baseUrl: BASE_URL,
    timestamp: new Date().toISOString(),
    defectCount: defects.length,
    defects,
    screenshotsDir: OUT_DIR,
  };
  const reportPath = path.join(OUT_DIR, "report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log("\n=== VISUAL QA REPORT ===");
  console.log(`Defects: ${defects.length}`);
  for (const d of defects) {
    console.log(`[${d.severity}] ${d.page} (${d.viewport}): ${d.issue}`);
  }
  console.log(`\nFull report: ${reportPath}`);
  process.exit(defects.filter((d) => d.severity === "high").length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
