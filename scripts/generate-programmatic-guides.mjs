/**
 * Generates 50 programmatic SEO guide markdown files.
 * Run: node scripts/generate-programmatic-guides.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "content/guides");

const GUIDES = [
  { slug: "how-to-calculate-emi", title: "How to Calculate EMI — Step-by-Step Guide", toolSlug: "emi-calculator", hub: "finance-tools", category: "Finance", tools: ["emi-calculator", "loan-calculator"], related: ["emi-formula-explained", "home-loan-emi-guide"], topic: "EMI calculation for Indian loans" },
  { slug: "emi-formula-explained", title: "EMI Formula Explained — Maths Behind Your Loan", toolSlug: "emi-calculator", hub: "finance-tools", category: "Finance", tools: ["emi-calculator", "loan-calculator"], related: ["how-to-calculate-emi", "emi-vs-flat-rate"], topic: "reducing-balance EMI formula" },
  { slug: "fd-interest-formula", title: "FD Interest Formula — Fixed Deposit Maturity", toolSlug: "fd-calculator", hub: "investment-tools", category: "Finance", tools: ["fd-calculator", "rd-calculator"], related: ["fd-vs-rd-comparison", "compound-interest-basics"], topic: "fixed deposit interest compounding" },
  { slug: "ppf-maturity-calculation", title: "PPF Maturity Calculation — 15-Year Projection", toolSlug: "ppf-calculator", hub: "investment-tools", category: "Finance", tools: ["ppf-calculator", "sip-calculator"], related: ["ppf-vs-fd-comparison", "sip-calculation-formula"], topic: "Public Provident Fund maturity" },
  { slug: "hra-exemption-rules", title: "HRA Exemption Rules — Indian Income Tax", toolSlug: "hra-calculator", hub: "finance-tools", category: "Finance", tools: ["hra-calculator", "percentage-calculator"], related: ["hra-metro-non-metro-rules", "how-to-calculate-emi"], topic: "House Rent Allowance exemption" },
  { slug: "gst-formula", title: "GST Formula — Add, Remove & Split Tax", toolSlug: "gst-calculator", hub: "gst-tools", category: "Business", tools: ["gst-calculator", "gst-invoice-generator"], related: ["gst-cgst-sgst-split", "gst-invoice-format"], topic: "GST calculation in India" },
  { slug: "gst-invoice-format", title: "GST Invoice Format — Mandatory Fields", toolSlug: "gst-invoice-generator", hub: "gst-tools", category: "Business", tools: ["gst-invoice-generator", "invoice-generator"], related: ["gst-formula", "invoice-numbering-rules"], topic: "GST tax invoice structure" },
  { slug: "profit-margin-formula", title: "Profit Margin Formula — Gross & Net", toolSlug: "profit-margin-calculator", hub: "business-tools", category: "Business", tools: ["profit-margin-calculator", "break-even-calculator"], related: ["profit-markup-vs-margin", "break-even-formula"], topic: "profit margin and markup" },
  { slug: "break-even-formula", title: "Break-Even Formula — Units & Revenue", toolSlug: "break-even-calculator", hub: "business-tools", category: "Business", tools: ["break-even-calculator", "profit-margin-calculator"], related: ["break-even-units-formula", "profit-margin-formula"], topic: "break-even analysis" },
  { slug: "what-is-schema-markup", title: "What Is Schema Markup — Structured Data SEO", toolSlug: "schema-markup-generator", hub: "seo-tools", category: "SEO", tools: ["schema-markup-generator", "meta-tag-generator"], related: ["sitemap-seo-guide", "internal-linking-seo-guide"], topic: "JSON-LD schema markup" },
  { slug: "what-is-open-graph", title: "What Is Open Graph — Social Preview Tags", toolSlug: "open-graph-generator", hub: "seo-tools", category: "SEO", tools: ["open-graph-generator", "meta-tag-generator"], related: ["open-graph-image-size-guide", "meta-description-best-practices"], topic: "Open Graph meta tags" },
  { slug: "sip-calculation-formula", title: "SIP Calculation Formula — Mutual Fund Returns", toolSlug: "sip-calculator", hub: "investment-tools", category: "Finance", tools: ["sip-calculator", "ppf-calculator"], related: ["sip-vs-lumpsum", "ppf-maturity-calculation"], topic: "SIP future value formula" },
  { slug: "rd-maturity-formula", title: "RD Maturity Formula — Recurring Deposits", toolSlug: "rd-calculator", hub: "investment-tools", category: "Finance", tools: ["rd-calculator", "fd-calculator"], related: ["fd-interest-formula", "fd-vs-rd-comparison"], topic: "recurring deposit maturity" },
  { slug: "loan-processing-fee-impact", title: "Loan Processing Fee Impact on Total Cost", toolSlug: "loan-calculator", hub: "finance-tools", category: "Finance", tools: ["loan-calculator", "emi-calculator"], related: ["emi-formula-explained", "personal-loan-emi-guide"], topic: "processing fees in loan APR" },
  { slug: "home-loan-emi-guide", title: "Home Loan EMI Guide — Property Finance India", toolSlug: "emi-calculator", hub: "finance-tools", category: "Finance", tools: ["emi-calculator", "loan-calculator"], related: ["how-to-calculate-emi", "emi-vs-flat-rate"], topic: "home loan EMI planning" },
  { slug: "personal-loan-emi-guide", title: "Personal Loan EMI Guide — Unsecured Borrowing", toolSlug: "loan-calculator", hub: "finance-tools", category: "Finance", tools: ["loan-calculator", "emi-calculator"], related: ["loan-processing-fee-impact", "how-to-calculate-emi"], topic: "personal loan repayment" },
  { slug: "car-loan-emi-calculator-guide", title: "Car Loan EMI Guide — Auto Finance", toolSlug: "emi-calculator", hub: "finance-tools", category: "Finance", tools: ["emi-calculator", "loan-calculator"], related: ["home-loan-emi-guide", "emi-formula-explained"], topic: "vehicle loan EMI" },
  { slug: "education-loan-planning", title: "Education Loan Planning — Study Finance", toolSlug: "loan-calculator", hub: "finance-tools", category: "Finance", tools: ["loan-calculator", "emi-calculator"], related: ["personal-loan-emi-guide", "how-to-calculate-emi"], topic: "education loan repayment planning" },
  { slug: "gst-cgst-sgst-split", title: "CGST SGST IGST Split — Interstate vs Intrastate", toolSlug: "gst-calculator", hub: "gst-tools", category: "Business", tools: ["gst-calculator", "gst-invoice-generator"], related: ["gst-formula", "gst-rate-slabs-india"], topic: "GST component split" },
  { slug: "invoice-numbering-rules", title: "Invoice Numbering Rules — GST Compliance", toolSlug: "invoice-generator", hub: "business-tools", category: "Business", tools: ["invoice-generator", "gst-invoice-generator"], related: ["gst-invoice-format", "gst-formula"], topic: "sequential invoice numbering" },
  { slug: "percentage-change-formula", title: "Percentage Change Formula — Growth & Decline", toolSlug: "percentage-calculator", hub: "business-tools", category: "Guides", tools: ["percentage-calculator", "discount-calculator"], related: ["discount-formula-explained", "profit-margin-formula"], topic: "percentage increase and decrease" },
  { slug: "discount-formula-explained", title: "Discount Formula Explained — Sale Pricing", toolSlug: "discount-calculator", hub: "business-tools", category: "Business", tools: ["discount-calculator", "percentage-calculator"], related: ["percentage-change-formula", "profit-markup-vs-margin"], topic: "retail discount math" },
  { slug: "compound-interest-basics", title: "Compound Interest Basics — Wealth Growth", toolSlug: "fd-calculator", hub: "investment-tools", category: "Finance", tools: ["fd-calculator", "sip-calculator"], related: ["simple-interest-vs-compound", "fd-interest-formula"], topic: "compound interest fundamentals" },
  { slug: "simple-interest-vs-compound", title: "Simple vs Compound Interest — Comparison", toolSlug: "fd-calculator", hub: "investment-tools", category: "Finance", tools: ["fd-calculator", "rd-calculator"], related: ["compound-interest-basics", "fd-vs-rd-comparison"], topic: "simple and compound interest" },
  { slug: "unit-conversion-basics", title: "Unit Conversion Basics — Metric & Imperial", toolSlug: "unit-converter", hub: "business-tools", category: "Guides", tools: ["unit-converter", "percentage-calculator"], related: ["km-to-miles-guide", "kg-to-lbs-guide"], topic: "unit conversion principles" },
  { slug: "km-to-miles-guide", title: "Kilometres to Miles — Conversion Guide", toolSlug: "unit-converter", hub: "business-tools", category: "Guides", tools: ["unit-converter", "percentage-calculator"], related: ["unit-conversion-basics", "celsius-fahrenheit-guide"], topic: "km to miles conversion" },
  { slug: "kg-to-lbs-guide", title: "Kilograms to Pounds — Weight Conversion", toolSlug: "unit-converter", hub: "business-tools", category: "Guides", tools: ["unit-converter", "percentage-calculator"], related: ["unit-conversion-basics", "km-to-miles-guide"], topic: "kg to lbs conversion" },
  { slug: "celsius-fahrenheit-guide", title: "Celsius to Fahrenheit — Temperature Guide", toolSlug: "unit-converter", hub: "business-tools", category: "Guides", tools: ["unit-converter", "percentage-calculator"], related: ["unit-conversion-basics", "liters-to-gallons-guide"], topic: "temperature scale conversion" },
  { slug: "liters-to-gallons-guide", title: "Liters to Gallons — Volume Conversion", toolSlug: "unit-converter", hub: "business-tools", category: "Guides", tools: ["unit-converter", "percentage-calculator"], related: ["unit-conversion-basics", "square-feet-to-square-meters-guide"], topic: "liters to gallons" },
  { slug: "square-feet-to-square-meters-guide", title: "Square Feet to Square Meters — Area Guide", toolSlug: "unit-converter", hub: "business-tools", category: "Guides", tools: ["unit-converter", "percentage-calculator"], related: ["unit-conversion-basics", "km-to-miles-guide"], topic: "area unit conversion for real estate" },
  { slug: "meta-description-best-practices", title: "Meta Description Best Practices for SEO", toolSlug: "meta-tag-generator", hub: "seo-tools", category: "SEO", tools: ["meta-tag-generator", "open-graph-generator"], related: ["canonical-url-seo-guide", "what-is-open-graph"], topic: "meta description writing" },
  { slug: "canonical-url-seo-guide", title: "Canonical URL SEO Guide — Duplicate Content", toolSlug: "meta-tag-generator", hub: "seo-tools", category: "SEO", tools: ["meta-tag-generator", "sitemap-generator"], related: ["robots-meta-tags-guide", "meta-description-best-practices"], topic: "canonical link element" },
  { slug: "robots-meta-tags-guide", title: "Robots Meta Tags — Indexing Control", toolSlug: "meta-tag-generator", hub: "seo-tools", category: "SEO", tools: ["meta-tag-generator", "schema-markup-generator"], related: ["canonical-url-seo-guide", "sitemap-seo-guide"], topic: "robots noindex nofollow" },
  { slug: "sitemap-seo-guide", title: "XML Sitemap SEO Guide — Crawl Discovery", toolSlug: "sitemap-generator", hub: "seo-tools", category: "SEO", tools: ["sitemap-generator", "schema-markup-generator"], related: ["internal-linking-seo-guide", "what-is-schema-markup"], topic: "XML sitemaps for search engines" },
  { slug: "internal-linking-seo-guide", title: "Internal Linking SEO Guide — Site Architecture", toolSlug: "sitemap-generator", hub: "seo-tools", category: "SEO", tools: ["sitemap-generator", "slug-generator"], related: ["sitemap-seo-guide", "slug-url-best-practices"], topic: "internal link strategy" },
  { slug: "word-count-seo-guide", title: "Word Count for SEO — Content Length", toolSlug: "word-counter", hub: "seo-tools", category: "SEO", tools: ["word-counter", "slug-generator"], related: ["meta-description-best-practices", "internal-linking-seo-guide"], topic: "content length and SEO" },
  { slug: "slug-url-best-practices", title: "URL Slug Best Practices — Clean Permalinks", toolSlug: "slug-generator", hub: "seo-tools", category: "SEO", tools: ["slug-generator", "meta-tag-generator"], related: ["canonical-url-seo-guide", "internal-linking-seo-guide"], topic: "SEO-friendly URLs" },
  { slug: "fd-vs-rd-comparison", title: "FD vs RD — Which Deposit Suits You?", toolSlug: "fd-calculator", hub: "investment-tools", category: "Finance", tools: ["fd-calculator", "rd-calculator"], related: ["fd-interest-formula", "rd-maturity-formula"], topic: "FD versus RD comparison" },
  { slug: "ppf-vs-fd-comparison", title: "PPF vs FD — Tax-Free vs Taxable Returns", toolSlug: "ppf-calculator", hub: "investment-tools", category: "Finance", tools: ["ppf-calculator", "fd-calculator"], related: ["ppf-maturity-calculation", "fd-vs-rd-comparison"], topic: "PPF vs fixed deposit" },
  { slug: "sip-vs-lumpsum", title: "SIP vs Lumpsum — Investment Strategy", toolSlug: "sip-calculator", hub: "investment-tools", category: "Finance", tools: ["sip-calculator", "fd-calculator"], related: ["sip-calculation-formula", "compound-interest-basics"], topic: "SIP versus one-time investment" },
  { slug: "emi-vs-flat-rate", title: "Reducing Balance EMI vs Flat Rate Loans", toolSlug: "emi-calculator", hub: "finance-tools", category: "Finance", tools: ["emi-calculator", "loan-calculator"], related: ["emi-formula-explained", "how-to-calculate-emi"], topic: "flat rate vs reducing balance" },
  { slug: "hra-metro-non-metro-rules", title: "HRA Metro vs Non-Metro City Rules", toolSlug: "hra-calculator", hub: "finance-tools", category: "Finance", tools: ["hra-calculator", "percentage-calculator"], related: ["hra-exemption-rules", "how-to-calculate-emi"], topic: "HRA 50% vs 40% rule" },
  { slug: "gst-rate-slabs-india", title: "GST Rate Slabs in India — 5% to 28%", toolSlug: "gst-calculator", hub: "gst-tools", category: "Business", tools: ["gst-calculator", "gst-invoice-generator"], related: ["gst-formula", "gst-cgst-sgst-split"], topic: "GST rate structure India" },
  { slug: "profit-markup-vs-margin", title: "Markup vs Margin — Pricing Mistakes", toolSlug: "profit-margin-calculator", hub: "business-tools", category: "Business", tools: ["profit-margin-calculator", "break-even-calculator"], related: ["profit-margin-formula", "discount-formula-explained"], topic: "markup versus margin" },
  { slug: "break-even-units-formula", title: "Break-Even Units Formula — Contribution Margin", toolSlug: "break-even-calculator", hub: "business-tools", category: "Business", tools: ["break-even-calculator", "profit-margin-calculator"], related: ["break-even-formula", "profit-margin-formula"], topic: "break-even unit calculation" },
  { slug: "color-hex-rgb-hsl-guide", title: "HEX RGB HSL Color Guide — Web Design", toolSlug: "color-converter", hub: "developer-tools", category: "Developer", tools: ["color-converter", "slug-generator"], related: ["slug-url-best-practices", "what-is-open-graph"], topic: "web color formats" },
  { slug: "timestamp-unix-guide", title: "Unix Timestamp Guide — Epoch Time", toolSlug: "timestamp-converter", hub: "developer-tools", category: "Developer", tools: ["timestamp-converter", "jwt-decoder"], related: ["json-vs-xml-data", "url-encoding-seo-impact"], topic: "Unix epoch timestamps" },
  { slug: "json-vs-xml-data", title: "JSON vs XML — Data Format Comparison", toolSlug: "json-formatter", hub: "developer-tools", category: "Developer", tools: ["json-formatter", "xml-formatter"], related: ["timestamp-unix-guide", "url-encoding-seo-impact"], topic: "JSON versus XML" },
  { slug: "url-encoding-seo-impact", title: "URL Encoding — SEO & API Safety", toolSlug: "url-encoder", hub: "developer-tools", category: "Developer", tools: ["url-encoder", "url-decoder"], related: ["slug-url-best-practices", "canonical-url-seo-guide"], topic: "percent-encoding URLs" },
  { slug: "open-graph-image-size-guide", title: "Open Graph Image Size — Social Preview", toolSlug: "open-graph-generator", hub: "seo-tools", category: "SEO", tools: ["open-graph-generator", "image-resizer"], related: ["what-is-open-graph", "meta-description-best-practices"], topic: "og:image dimensions" },
];

function paragraph(text) {
  return text.trim();
}

function buildBody(g) {
  const toolLink = `/tools/${g.toolSlug}`;
  const hubLink = `/${g.hub}`;
  const t2 = g.tools[1] ? `/tools/${g.tools[1]}` : toolLink;
  const r1 = `/guides/${g.related[0]}`;
  const r2 = `/guides/${g.related[1]}`;
  const conv = g.tools[0].includes("unit") ? "/conversions/km-to-miles" : "/calculators/home-loan-calculator";

  const sections = [
    `Understanding ${g.topic} is essential for professionals, students and business owners who rely on accurate numbers every day. On MerQPrime we built free browser tools so you can verify calculations instantly without spreadsheets, sign-up walls or ads blocking your workflow. This guide walks through definitions, formulas, worked examples, common mistakes and how our calculators fit into your routine.`,
    `Whether you are comparing loan offers, filing GST returns, planning investments or optimising a website for Google, the underlying maths should be transparent. Indian regulations and market conventions add local nuance — from reducing-balance EMI to CGST/SGST splits — so generic overseas articles often miss critical detail. We focus on India-first scenarios while keeping explanations accessible.`,
    `MerQPrime processes every calculation locally in your browser. Sensitive salary figures, loan amounts and business costs never leave your device. That privacy-first design makes our tools safe for quick checks on shared workstations and client calls alike.`,
    `## Core concepts`,
    `Before diving into arithmetic, clarify what ${g.topic} means in practice. Definitions anchor every formula: identify inputs (principal, rate, tenure, tax slab, word count, URL path), outputs (EMI, maturity value, meta tag snippet, converted units) and constraints (regulatory caps, rounding rules, compounding frequency).`,
    `Professionals often skip this step and jump straight to calculators — which is fine when you trust the tool — but understanding the components helps you spot unrealistic bank quotes, invoice errors or SEO recommendations that do not apply to your case.`,
    `## Formula and method`,
    `The standard approach to ${g.topic} follows established textbook and industry conventions. Write down inputs with units, apply the formula in consistent order, and round only at the end unless your lender or auditor specifies otherwise.`,
    `For Indian financial products, always confirm whether quotes use monthly or annual rates, whether compounding is quarterly or monthly, and whether fees are flat or percentage-based. Small convention mismatches create large EMI or maturity gaps over long tenures.`,
    `Use our primary tool at [${g.tools[0].replace(/-/g, " ")}](${toolLink}) to avoid manual slip-ups. Pair it with [${g.tools[1]?.replace(/-/g, " ") ?? "related calculator"}](${t2}) when your scenario spans multiple steps — for example EMI plus processing fee, or GST plus invoice formatting.`,
    `## Worked examples`,
    `**Example 1:** A typical beginner scenario for ${g.topic}. Plug the numbers into the linked calculator, compare against your spreadsheet, and sanity-check whether the output magnitude makes sense (EMI should not exceed half of take-home pay; GST should match the slab you expect).`,
    `**Example 2:** A intermediate case with different tenure or rate. Notice how linear changes do not always produce linear outputs — compound interest and amortization curves are non-linear, which is why visualizing full schedules matters.`,
    `**Example 3:** An edge case — very short tenure, very long horizon, zero input, or maximum regulatory limit. Good tools handle validation gracefully; if yours shows an error, re-read input units (lakhs vs rupees, months vs years).`,
    `Document each example you run. Screenshots or copied results help when discussing options with a co-borrower, accountant or client.`,
    `## Common mistakes`,
    `Mixing monthly and annual rates is the most frequent error in Indian loan math. Always divide annual percentage by 12 for EMI formulas unless the lender explicitly provides a monthly rate.`,
    `Ignoring processing fees understates true borrowing cost. Use the loan calculator variant when fees apply.`,
    `For GST, applying the wrong slab or forgetting interstate IGST breaks reconciliation with GSTR filings.`,
    `For SEO guides, duplicating meta descriptions across pages wastes crawl budget; write unique copy per URL even when topics overlap.`,
    `For unit conversion, confusing US gallons with imperial gallons shifts volume results by roughly twenty percent — verify which standard your data sheet uses.`,
    `## India-specific considerations`,
    `Regulatory updates land frequently — RBI repo rate changes, PPF rate notifications, GST council meetings. MerQPrime tools let you enter current values directly rather than hard-coding outdated rates.`,
    `Salaried taxpayers in metro cities face different HRA exemption percentages than non-metro residents. Business owners must issue GST invoices with correct HSN codes. E-commerce sellers juggle margin, discount and break-even math on thin SKUs.`,
    `Developers and marketers share needs too: clean URLs, schema markup, Open Graph previews and Unix timestamps appear in everyday release checklists. Our [Developer Tools hub](${g.hub === "developer-tools" ? hubLink : "/developer-tools"}) and [SEO Tools hub](${g.hub === "seo-tools" ? hubLink : "/seo-tools"}) collect related utilities.`,
    `## Step-by-step workflow`,
    `1. Gather inputs from sanction letters, catalogues, analytics or design specs.`,
    `2. Open the relevant MerQPrime tool — start with [${g.toolSlug.replace(/-/g, " ")}](${toolLink}).`,
    `3. Enter values and review outputs; adjust one variable at a time to see sensitivity.`,
    `4. Cross-check with a second tool when the scenario spans domains (EMI + HRA, GST + invoice).`,
    `5. Save results for records; use copy/share buttons on tool pages.`,
    `6. Read related guides for deeper context: [${g.related[0].replace(/-/g, " ")}](${r1}) and [${g.related[1].replace(/-/g, " ")}](${r2}).`,
    `7. Explore the authority hub at [${g.hub.replace(/-/g, " ")}](${hubLink}) for curated tools and articles.`,
    `## Tools and related pages`,
    `Primary calculator: [${g.toolSlug}](${toolLink}). Secondary: [${g.tools[1]}](${t2}).`,
    `Authority hub: [${g.hub}](${hubLink}).`,
    `Related programmatic calculator: [calculator landing](${conv}).`,
    `Conversion reference (when units apply): browse [unit conversions](/conversions/km-to-miles) for dedicated km-mile, kg-lb and temperature pages.`,
    `## Advanced tips`,
    `Sensitivity analysis separates amateurs from professionals. Change ±1% rate or ±12 months tenure and note EMI or maturity swings. For SEO, A/B test meta descriptions on high-impression URLs. For developers, store timestamps in UTC and convert for display only.`,
    `Batch workflows benefit from pairing CSV converters with JSON formatters; finance teams export EMI tables to share with stakeholders.`,
    `Bookmark tool pages you reuse weekly — consistent URLs from MerQPrime load fast on mobile networks across India.`,
    `## When to seek professional advice`,
    `Calculators educate; they do not replace chartered accountants, tax attorneys or certified financial planners. File ITR with validated HRA and deduction claims through a CA when portfolios grow complex.`,
    `Loan sanctions depend on credit scores and lender policy beyond EMI affordability ratios. Investment returns are not guaranteed — use SIP and FD projections as planning guides only.`,
    `## Summary`,
    `${g.topic} becomes manageable when you understand inputs, apply the right formula, avoid unit mistakes and use trustworthy calculators. MerQPrime keeps the experience free, private and fast — built for Indian users who need answers now, not after a sales call.`,
    `Continue learning with [${g.related[0]}](${r1}), [${g.related[1]}](${r2}), and the [${g.hub} hub](${hubLink}). Open the [${g.toolSlug} tool](${toolLink}) to run your numbers immediately.`,
  ];

  return sections.map((s) => (s.startsWith("##") ? s : paragraph(s))).join("\n\n");
}

function buildFaqs(g) {
  return [
    { q: `What is the best free tool for ${g.topic}?`, a: `MerQPrime's ${g.toolSlug.replace(/-/g, " ")} at /tools/${g.toolSlug} runs in your browser with no sign-up.` },
    { q: `Is this guide relevant for India?`, a: "Yes. Examples and conventions focus on Indian loans, tax rules, GST and local SEO practice." },
    { q: `Can I share results with my team?`, a: "Use copy and share actions on tool pages. Data is not stored on our servers." },
  ];
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

for (const g of GUIDES) {
  const faqs = buildFaqs(g);
  const fm = `---
title: "${g.title}"
description: "Complete guide to ${g.topic}. Formulas, examples, India context and free MerQPrime tools."
publishedAt: "2026-06-20"
category: "${g.category}"
keywords:
  - ${g.slug.replace(/-/g, " ")}
  - ${g.topic}
  - merqprime guide
  - ${g.category.toLowerCase()} guide
  - online calculator india
toolSlug: ${g.toolSlug}
hubSlug: ${g.hub}
relatedToolSlugs:
  - ${g.tools[0]}
  - ${g.tools[1]}
relatedGuideSlugs:
  - ${g.related[0]}
  - ${g.related[1]}
relatedPageSlugs:
  - ${g.related[0]}
  - ${g.related[1]}
faqs:
${faqs.map((f) => `  - question: "${f.q}"\n    answer: "${f.a}"`).join("\n")}
---

${buildBody(g)}
`;
  fs.writeFileSync(path.join(OUT, `${g.slug}.md`), fm, "utf8");
  const words = buildBody(g).split(/\s+/).length;
  console.log(`✓ ${g.slug}.md (${words} words)`);
}

console.log(`\nGenerated ${GUIDES.length} guides.`);
